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

            var res = _dbConnection.GetModelDetails(RawSQL.GetProfileData(uidNo, rollNo)).AsEnumerable().FirstOrDefault();

            var sdfsd = res.ItemArray;
            var sdfssfg = res.GetHashCode();
            var profileData = new ProfileInfo()
            {
                Title = res.Field<string>("title"),
                FullName = res.Field<string>("Name_Full"),
                DateOfBirth = res.Field<DateTime?>("Date_Birth"),
                Gender = res.Field<string>("Gender"),
                Caste = res.Field<string>("Caste"),
                MaritalStatus = res.Field<string>("Marital_Status"),
                Nationality = res.Field<string>("Nationality"),
                AadharNo = res.Field<string>("aadharNo"),
                PanNo = res.Field<string>("panNo")
            };

            var contactData = new ContactInfo()
            {
                ResidenceAddr = res.Field<string>("residenceAddr"),
                City = res.Field<string>("city"),
                Pincode = res.Field<string>("pincode"),
                MobileNo1 = res.Field<string>("mobileNo1"),
                MobileNo2 = res.Field<string>("mobileNo2"),
                EmergencyContact = res.Field<string>("emergencyContact"),
                EmergencyContactNo = res.Field<string>("emergencyContactNo"),
                Email1 = res.Field<string>("email1"),
                Email2 = res.Field<string>("email2")
            };

            return new UserProfileModal();
        }
    }
}
