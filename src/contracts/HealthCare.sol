// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25 <0.9.0;

contract HealthCare {
    address private owner;

    struct Patient {
        string name;
        uint8 age;
        address id;
        address[] doctor_list;
    }

    struct Doctor {
        string name;
        address id;
        address[] patient_list;
    }

    mapping(address => Doctor) private doctors;
    mapping(address => Patient) private patients;
    mapping(address => mapping(address => uint256)) private doctorToPatient; // doctors to patient list
    mapping(address => mapping(address => uint256)) private patientToDoctor;

    constructor() {
        owner = msg.sender;
    }

    modifier checkDoctor(address id) {
        Doctor memory d = doctors[id];
        require(d.id > address(0x0)); //check if doctor exist
        _;
    }

    modifier checkPatient(address id) {
        Patient memory p = patients[id];
        require(p.id > address(0x0)); //check if patient exist
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    //   modifier checkFileAccess(string memory role, address id, bytes32 fileHashId, address pat) {
    //     uint pos;
    //     if(keccak256(abi.encodePacked(role)) == keccak256("doctor")) {
    //         require(patientToDoctor[pat][id] > 0);
    //         pos = patientToFile[pat][fileHashId];
    //         require(pos > 0);
    //     }
    //     else if(keccak256(abi.encodePacked(role)) == keccak256("patient")) {
    //         pos = patientToFile[id][fileHashId];
    //         require(pos > 0);
    //     }
    //     _;
    //   }

    //   modifier checkFile(bytes32 fileHashId) {
    //     bytes memory tempString = bytes(hashToFile[fileHashId].file_name);
    //     require(tempString.length > 0);//check if file exist
    //     _;
    //   }

    function signupPatient(string memory _name, uint8 _age) public {
        Patient memory p = patients[msg.sender];
        require(keccak256(abi.encodePacked(_name)) != keccak256(""));
        require((_age > 0) && (_age < 100));
        require(!(p.id > address(0x0)));

        patients[msg.sender] = Patient({
            name: _name,
            age: _age,
            id: msg.sender,
            doctor_list: new address[](0)
        });
    }

    function signupDoctor(string memory _name) public {
        Doctor memory d = doctors[msg.sender];
        require(keccak256(abi.encodePacked(_name)) != keccak256(""));
        require(!(d.id > address(0x0)));

        doctors[msg.sender] = Doctor({
            name: _name,
            id: msg.sender,
            patient_list: new address[](0)
        });
    }

    function grantAccessToDoctor(
        address doctor_id
    ) public checkPatient(msg.sender) checkDoctor(doctor_id) {
        Patient storage p = patients[msg.sender];
        Doctor storage d = doctors[doctor_id];
        require(patientToDoctor[msg.sender][doctor_id] < 1); // this means doctor already been access

        p.doctor_list.push(doctor_id); // new length of array
        // gpos = pos;
        uint pos = p.doctor_list.length;
        patientToDoctor[msg.sender][doctor_id] = pos;
        d.patient_list.push(msg.sender);
    }

    //   function addFile(string memory _file_name, string memory _file_type, bytes32 _fileHash, string memory _file_secret) public checkPatient(msg.sender) {
    //       patient storage p = patients[msg.sender];

    //       require(patientToFile[msg.sender][_fileHash] < 1);

    //       hashToFile[_fileHash] = filesInfo({file_name:_file_name, file_type:_file_type,file_secret:_file_secret});
    //       uint pos = p.files.push(_fileHash);
    //       patientToFile[msg.sender][_fileHash] = pos;
    //   }

    function getPatientProfile()
        public
        view
        checkPatient(msg.sender)
        returns (string memory, uint8, address[] memory)
    {
        Patient memory p = patients[msg.sender];
        return (p.name, p.age, p.doctor_list);
    }

    function getDoctorProfile()
        public
        view
        checkDoctor(msg.sender)
        returns (string memory, address[] memory)
    {
        Doctor memory d = doctors[msg.sender];
        return (d.name, d.patient_list);
    }

    //   function checkProfile(address _user) public view onlyOwner returns(string memory, string memory){
    //       patient memory p = patients[_user];
    //       doctor memory d = doctors[_user];

    //       if(p.id > address(0x0))
    //           return (p.name, 'patient');
    //       else if(d.id > address(0x0))
    //           return (d.name, 'doctor');
    //       else
    //           return ('', '');
    //   }

    function getPatientInfoForDoctor(
        address pat
    )
        public
        view
        checkPatient(pat)
        checkDoctor(msg.sender)
        returns (string memory, uint8, address)
    {
        Patient memory p = patients[pat];

        require(patientToDoctor[pat][msg.sender] > 0);

        return (p.name, p.age, p.id);
    }

    //   function getFileInfo(bytes32 fileHashId) private view checkFile(fileHashId) returns(filesInfo memory) {
    //       return hashToFile[fileHashId];
    //   }

    //   function getFileSecret(bytes32 fileHashId, string memory role, address id, address pat) public view
    //   checkFile(fileHashId) checkFileAccess(role, id, fileHashId, pat)
    //   returns(string memory) {
    //       filesInfo memory f = getFileInfo(fileHashId);
    //       return (f.file_secret);
    //   }

    //   function getFileInfoDoctor(address doc, address pat, bytes32 fileHashId) public view
    //   onlyOwner checkPatient(pat) checkDoctor(doc) checkFileAccess("doctor", doc, fileHashId, pat)
    //   returns(string memory, string memory) {
    //       filesInfo memory f = getFileInfo(fileHashId);
    //       return (f.file_name, f.file_type);
    //   }

    //   function getFileInfoPatient(address pat, bytes32 fileHashId) public view
    //   onlyOwner checkPatient(pat) checkFileAccess("patient", pat, fileHashId, pat) returns(string memory, string memory) {
    //       filesInfo memory f = getFileInfo(fileHashId);
    //       return (f.file_name, f.file_type);
    //   }
}
