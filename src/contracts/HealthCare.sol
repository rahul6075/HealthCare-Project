// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25 <0.9.0;

contract HealthCare {
    address private owner;
    uint private reportCount;

    struct Hospital {
        address id;
        string name;
        string email;
        uint phone;
        string description;
        string location;
    }

    struct Doctor {
        address id;
        string name;
        string email;
        uint phone;
        string type_name;
        string location;
        address hospital;
        address[] patient_list;
    }

    struct Patient {
        address id;
        string name;
        uint phone;
        string email;
        string dob;
        string bloodGroup;
        string permanentAddress;
        address[] doctor_list;
        // uint score;
        // Analysis[] history;
    }

    struct Analysis {
        uint256 ID;
        string testName;
        address hospital;
        address doctor;
        uint256 price;
        string date;
        uint256 value;
        uint256 min;
        uint256 max;
        uint256 weight;
        address[] signatures;
    }

    mapping(address => Hospital) private hospitals;
    mapping(address => Doctor) private doctors;
    mapping(address => Patient) private patients;
    mapping(address => Analysis[]) reports;

    mapping(address => mapping(address => uint256)) private doctorToPatient; // doctors to patient list
    mapping(address => mapping(address => uint256)) private patientToDoctor;

    constructor() {
        owner = msg.sender;
        reportCount = 0;
    }

    modifier checkDoctor(address id) {
        Doctor memory d = doctors[id];
        require(d.id > address(0x0), "Doctor Not Found or Access Denied");
        _;
    }

    modifier checkPatient(address id) {
        Patient storage p = patients[id];
        require(p.id > address(0x0), "Patient Not Found or Access Denied");
        _;
    }

    modifier checkHospital(address id) {
        Hospital storage h = hospitals[id];
        require(h.id > address(0x0), "Hospital Not Found or Access Denied");
        _;
    }

    modifier checkDoctorOrHospital(address id) {
        Hospital memory h = hospitals[msg.sender];
        Doctor memory d = doctors[msg.sender];
        require(
            h.id > address(0x0) || d.id > address(0x0),
            "User not found or Access Denied"
        );
        _;
    }

    event Signup(address add, string name, string role);

    // -------------------------------------------------------------------------------
    //  Patient
    // -------------------------------------------------------------------------------

    function addPatient(
        string memory _name,
        uint _phone,
        string memory _email,
        string memory _dob,
        string memory _bloodGroup,
        string memory _permanentAddress
    ) public {
        Patient storage p = patients[msg.sender];
        require(keccak256(abi.encodePacked(_name)) != keccak256(""), "");
        require(!(p.id > address(0x0)), "Account already present");
        patients[msg.sender] = Patient({
            id: msg.sender,
            name: _name,
            phone: _phone,
            email: _email,
            dob: _dob,
            bloodGroup: _bloodGroup,
            permanentAddress: _permanentAddress,
            doctor_list: new address[](0)
        });
        emit Signup(msg.sender, _name, "Patient");
    }

    function getPatientInfo(
        address pAddress
    )
        public
        view
        checkDoctorOrHospital(msg.sender)
        checkPatient(pAddress)
        returns (
            string memory name,
            string memory email,
            uint phone,
            Analysis[] memory results,
            address[] memory doctor_list
        )
    {
        Patient memory p = patients[pAddress];
        return (p.name, p.email, p.phone, reports[msg.sender], p.doctor_list);
    }

    function getPatientProfile()
        public
        view
        checkPatient(msg.sender)
        returns (
            string memory name,
            string memory email,
            string memory dob,
            string memory bloodGroup,
            string memory permanentAddress,
            Analysis[] memory history
        )
    {
        Patient memory p = patients[msg.sender];
        return (
            p.name,
            p.email,
            p.dob,
            p.bloodGroup,
            p.permanentAddress,
            reports[msg.sender]
        );
    }

    function grantAccessToDoctor(
        address doctor_id
    ) public checkPatient(msg.sender) checkDoctor(doctor_id) {
        Patient storage p = patients[msg.sender];
        Doctor storage d = doctors[doctor_id];
        require(
            patientToDoctor[msg.sender][doctor_id] < 1,
            "This Doctor is already assigned"
        );

        p.doctor_list.push(doctor_id);
        patientToDoctor[msg.sender][doctor_id]++;
        doctorToPatient[doctor_id][msg.sender]++;
        d.patient_list.push(msg.sender);
    }

    function removeAccessFromDoctor(
        address doctor_id
    ) public checkPatient(msg.sender) checkDoctor(doctor_id) {
        require(
            patientToDoctor[msg.sender][doctor_id] > 0,
            "This Doctor is not assigned"
        );
        patientToDoctor[msg.sender][doctor_id] = 0;
        doctorToPatient[doctor_id][msg.sender] = 0;
    }

    // -------------------------------------------------------------------------------
    //  Doctor
    // -------------------------------------------------------------------------------

    function addDoctor(
        string memory _name,
        string memory email,
        uint phone,
        string memory _type_name,
        string memory _location
    ) public {
        Doctor memory d = doctors[msg.sender];
        require(keccak256(abi.encodePacked(_name)) != keccak256(""), "");
        require(!(d.id > address(0x0)), "Account already present");
        doctors[msg.sender] = Doctor({
            id: msg.sender,
            name: _name,
            email: email,
            phone: phone,
            type_name: _type_name,
            location: _location,
            hospital: address(0x0),
            patient_list: new address[](0)
        });
        emit Signup(msg.sender, _name, "Doctor");
    }

    function addAnalysis(
        address pat,
        string memory testName,
        address hospital,
        uint price,
        string memory date,
        uint value,
        uint min,
        uint max,
        uint weight
    ) public checkDoctor(msg.sender) {
        Doctor memory d = doctors[msg.sender];
        require(d.hospital == hospital, "Invalid Hospital");
        require(
            patientToDoctor[pat][msg.sender] > 0,
            "Doctor is not assigned to Patient"
        );
        address[] memory sign = new address[](1);
        sign[0] = msg.sender;
        reports[pat].push(
            Analysis({
                ID: reportCount,
                testName: testName,
                hospital: hospital,
                doctor: msg.sender,
                price: price,
                date: date,
                value: value,
                min: min,
                max: max,
                weight: weight,
                signatures: sign
            })
        );
        reportCount++;
    }

    // -------------------------------------------------------------------------------
    //  Hospital
    // -------------------------------------------------------------------------------

    function addHospital(
        string memory name,
        string memory descr,
        string memory location,
        uint _phone,
        string memory _email
    ) public {
        Hospital memory h = hospitals[msg.sender];
        require(keccak256(abi.encodePacked(name)) != keccak256(""), "");
        require(!(h.id > address(0x0)), "Account already present");
        hospitals[msg.sender] = Hospital(
            msg.sender,
            name,
            _email,
            _phone,
            descr,
            location
        );
        emit Signup(msg.sender, name, "Hospital");
    }

    function assignHostpitalToDoctor(
        address doc
    ) public checkHospital(msg.sender) checkDoctor(doc) {
        doctors[doc].hospital = msg.sender;
    }

    // -------------------------------------------------------------------------------
    //  Public functions
    // -------------------------------------------------------------------------------

    function Login()
        public
        view
        returns (
            address id,
            string memory name,
            string memory email,
            string memory role
        )
    {
        Patient memory p = patients[msg.sender];
        Hospital memory h = hospitals[msg.sender];
        Doctor memory d = doctors[msg.sender];
        if (p.id > address(0x0)) {
            return (msg.sender, p.name, p.email, "Patient");
        } else if (h.id > address(0x0)) {
            return (msg.sender, h.name, h.email, "Hospital");
        } else if (d.id > (address(0x0))) {
            return (msg.sender, d.name, d.email, "Doctor");
        }
        revert("NO Account found");
    }

    function getDoctorInfo(
        address dAddress
    )
        public
        view
        checkDoctor(dAddress)
        returns (
            string memory name,
            string memory email,
            uint phone,
            address hospital
        )
    {
        Doctor memory d = doctors[dAddress];
        return (d.name, d.email, d.phone, d.hospital);
    }
}

// contract HealthCare {
//     address private owner;

//     struct Patient {
//         string name;
//         uint8 age;
//         address id;
//         address[] doctor_list;
//     }

//     struct Doctor {
//         string name;
//         address id;
//         address[] patient_list;
//     }

//     mapping(address => Doctor) private doctors;
//     mapping(address => Patient) private patients;
//     mapping(address => mapping(address => uint256)) private doctorToPatient; // doctors to patient list
//     mapping(address => mapping(address => uint256)) private patientToDoctor;

//     //   modifier checkFileAccess(string memory role, address id, bytes32 fileHashId, address pat) {
//     //     uint pos;
//     //     if(keccak256(abi.encodePacked(role)) == keccak256("doctor")) {
//     //         require(patientToDoctor[pat][id] > 0);
//     //         pos = patientToFile[pat][fileHashId];
//     //         require(pos > 0);
//     //     }
//     //     else if(keccak256(abi.encodePacked(role)) == keccak256("patient")) {
//     //         pos = patientToFile[id][fileHashId];
//     //         require(pos > 0);
//     //     }
//     //     _;
//     //   }

//     //   modifier checkFile(bytes32 fileHashId) {
//     //     bytes memory tempString = bytes(hashToFile[fileHashId].file_name);
//     //     require(tempString.length > 0);//check if file exist
//     //     _;
//     //   }

//     function signupPatient(string memory _name, uint8 _age) public {
//         Patient memory p = patients[msg.sender];
//         require(keccak256(abi.encodePacked(_name)) != keccak256(""));
//         require((_age > 0) && (_age < 100));
//         require(!(p.id > address(0x0)));

//         patients[msg.sender] = Patient({
//             name: _name,
//             age: _age,
//             id: msg.sender,
//             doctor_list: new address[](0)
//         });
//     }

//     function signupDoctor(string memory _name) public {
//         Doctor memory d = doctors[msg.sender];
//         require(keccak256(abi.encodePacked(_name)) != keccak256(""));
//         require(!(d.id > address(0x0)));

//         doctors[msg.sender] = Doctor({
//             name: _name,
//             id: msg.sender,
//             patient_list: new address[](0)
//         });
//     }

//     function grantAccessToDoctor(
//         address doctor_id
//     ) public checkPatient(msg.sender) checkDoctor(doctor_id) {
//         Patient storage p = patients[msg.sender];
//         Doctor storage d = doctors[doctor_id];
//         require(patientToDoctor[msg.sender][doctor_id] < 1); // this means doctor already been access

//         p.doctor_list.push(doctor_id); // new length of array
//         // gpos = pos;
//         uint pos = p.doctor_list.length;
//         patientToDoctor[msg.sender][doctor_id] = pos;
//         d.patient_list.push(msg.sender);
//     }

//     //   function addFile(string memory _file_name, string memory _file_type, bytes32 _fileHash, string memory _file_secret) public checkPatient(msg.sender) {
//     //       patient storage p = patients[msg.sender];

//     //       require(patientToFile[msg.sender][_fileHash] < 1);

//     //       hashToFile[_fileHash] = filesInfo({file_name:_file_name, file_type:_file_type,file_secret:_file_secret});
//     //       uint pos = p.files.push(_fileHash);
//     //       patientToFile[msg.sender][_fileHash] = pos;
//     //   }

//     function getPatientProfile()
//         public
//         view
//         checkPatient(msg.sender)
//         returns (string memory, uint8, address[] memory)
//     {
//         Patient memory p = patients[msg.sender];
//         return (p.name, p.age, p.doctor_list);
//     }

//     function getDoctorProfile()
//         public
//         view
//         checkDoctor(msg.sender)
//         returns (string memory, address[] memory)
//     {
//         Doctor memory d = doctors[msg.sender];
//         return (d.name, d.patient_list);
//     }

//     //   function checkProfile(address _user) public view onlyOwner returns(string memory, string memory){
//     //       patient memory p = patients[_user];
//     //       doctor memory d = doctors[_user];

//     //       if(p.id > address(0x0))
//     //           return (p.name, 'patient');
//     //       else if(d.id > address(0x0))
//     //           return (d.name, 'doctor');
//     //       else
//     //           return ('', '');
//     //   }

//     function getPatientInfoForDoctor(
//         address pat
//     )
//         public
//         view
//         checkPatient(pat)
//         checkDoctor(msg.sender)
//         returns (string memory, uint8, address)
//     {
//         Patient memory p = patients[pat];

//         require(patientToDoctor[pat][msg.sender] > 0);

//         return (p.name, p.age, p.id);
//     }

//     //   function getFileInfo(bytes32 fileHashId) private view checkFile(fileHashId) returns(filesInfo memory) {
//     //       return hashToFile[fileHashId];
//     //   }

//     //   function getFileSecret(bytes32 fileHashId, string memory role, address id, address pat) public view
//     //   checkFile(fileHashId) checkFileAccess(role, id, fileHashId, pat)
//     //   returns(string memory) {
//     //       filesInfo memory f = getFileInfo(fileHashId);
//     //       return (f.file_secret);
//     //   }

//     //   function getFileInfoDoctor(address doc, address pat, bytes32 fileHashId) public view
//     //   onlyOwner checkPatient(pat) checkDoctor(doc) checkFileAccess("doctor", doc, fileHashId, pat)
//     //   returns(string memory, string memory) {
//     //       filesInfo memory f = getFileInfo(fileHashId);
//     //       return (f.file_name, f.file_type);
//     //   }

//     //   function getFileInfoPatient(address pat, bytes32 fileHashId) public view
//     //   onlyOwner checkPatient(pat) checkFileAccess("patient", pat, fileHashId, pat) returns(string memory, string memory) {
//     //       filesInfo memory f = getFileInfo(fileHashId);
//     //       return (f.file_name, f.file_type);
//     //   }
// }
