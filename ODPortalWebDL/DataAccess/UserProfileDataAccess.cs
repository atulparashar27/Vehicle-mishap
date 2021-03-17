using ODPortalWebDL.Constants;
using ODPortalWebDL.DTO;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace ODPortalWebDL.DataAccess
{
    public class UserProfileDataAccess
    {
        private readonly DbConnection _dbConnection;
        public UserProfileDataAccess()
        {
            _dbConnection = new DbConnection();
        }

        internal UserProfileModal GetProfileData(string uidNo, string rollNo)
        {
            UserProfileModal userProfileModal = new UserProfileModal();

            var genInfo = _dbConnection.GetModelDetails(RawSQL.GetProfileData(uidNo, rollNo)).AsEnumerable().FirstOrDefault();

            var branchInfo = _dbConnection.GetModelDetails(RawSQL.GetProfileBrInfo(Convert.ToDouble(rollNo))).AsEnumerable().FirstOrDefault();

            var sdfsd = genInfo.Table;
            var profileData = new ProfileInfo()
            {
                Title = genInfo?.Field<string>("Title"),
                FullName = genInfo?.Field<string>("Name_Full"),
                DateOfBirth = genInfo?.Field<DateTime?>("Date_Birth"),
                Gender = genInfo?.Field<string>("Gender"),
                Caste = genInfo?.Field<string>("Caste"),
                MaritalStatus = Convert.ToString(genInfo?.Field<Double?>("Marital_Status")) == "0" ? "Married" 
                                : Convert.ToString(genInfo?.Field<Double?>("Marital_Status")) == "1" ? "Single"
                                : Convert.ToString(genInfo?.Field<Double?>("Marital_Status")) == "3" ? "Widowed"
                                : Convert.ToString(genInfo?.Field<Double?>("Marital_Status")) == "4" ? "Divorced"
                                : Convert.ToString(genInfo?.Field<Double?>("Marital_Status")) == "5" ? "Other"
                                : "Other",
                Nationality = genInfo?.Field<string>("Nationality") == "I" ? "Indian" : "Other",
                AadharNo = genInfo.Field<string>("AadharNo"),
                PanNo = genInfo.Field<string>("PanCardNo")
            };

            var contactData = new ContactInfo()
            {
                ResidenceAddr = genInfo?.Field<string>("Add1") +
                                genInfo?.Field<string>("Add2") +
                                genInfo?.Field<string>("Add3"),
                City = genInfo?.Field<string>("City"),
                Pincode = genInfo?.Field<string>("Pin_cd"),
                MobileNo1 = genInfo?.Field<string>("Mobile"),
                MobileNo2 = genInfo?.Field<string>("Mobile1"),
                EmergencyContact = genInfo?.Field<string>("EmergencyContact"),
                EmergencyContactNo = genInfo?.Field<string>("EmergencyContactNo"),
                Email1 = genInfo?.Field<string>("Email1"),
                Email2 = genInfo?.Field<string>("Email2")
            };

            var occupationData = new CompanyInfo
            {
                OrgName = genInfo?.Field<string>("Organization"),
                OrgAddress = genInfo?.Field<string>("Place"),
                Designation = genInfo?.Field<string>("Designation"),
                Occupation = genInfo?.Field<string>("Occupation"),
                OfficePh1 = genInfo?.Field<string>("Off_ph1"),
                OfficePh2 = genInfo?.Field<string>("Off_ph2")
            };

            var qualificationData = new QualificationInfo
            {
                Qualification = genInfo?.Field<string>("Qualification")
            };

            var personBrInfo = new PersonBrInfo
            {
                RollNo = Convert.ToInt32(genInfo?.Field<Double?>("Roll_NO")),
                UidNo = genInfo?.Field<string>("UID_No"),
                BrTitle = genInfo?.Field<string>("Title_1"),
                GridCoord = genInfo?.Field<string>("Grid_Coord"),
                DateOfIni1 = branchInfo?.Field<DateTime?>("DOI_1"),
                DateOfIni2 = branchInfo?.Field<DateTime?>("DOI_2")
            };

            userProfileModal.ProfileList = profileData;
            userProfileModal.ContactInfo = contactData;
            userProfileModal.CompanyInfo = occupationData;
            userProfileModal.QualificationInfo = qualificationData;
            userProfileModal.PersonBrInfo = personBrInfo;
            return userProfileModal;
        }

        internal List<UserFamilyModal> GetFamilyData(string uidNo)
        {
            var familyCode = _dbConnection.GetModelDetails(RawSQL.GetFamilyCode(uidNo)).AsEnumerable().FirstOrDefault();
            var familyMemeber = _dbConnection.GetModelDetails(RawSQL.GetAllFamilyPeople(familyCode?.Field<double?>("Family_cd"))).AsEnumerable().ToList();
            var userFamily = new List<UserFamilyModal>();
            foreach(var detail in familyMemeber)
            {
                var personBrInfo = new UserFamilyModal
                {
                    Name = detail?.Field<string>("Name_Full"),
                    IniJigStatus = detail?.Field<string>("INI_JIG_NON") == "INI" ? "Initiated"
                                    : detail?.Field<string>("INI_JIG_NON") == "CHL" ? "Children"
                                    : detail?.Field<string>("INI_JIG_NON") == "OTH" ? "Other"
                                    : detail?.Field<string>("INI_JIG_NON") == "JIG" ? "Jigyasu" : "",
                    Relation = detail?.Field<string>("Reelation"),
                    UidNo = detail?.Field<string>("Uid_No"),
                    RollNo = Convert.ToInt32(detail?.Field<double?>("Roll_No"))
                };
                userFamily.Add(personBrInfo);
            }
            return userFamily;
        }
    }
}
