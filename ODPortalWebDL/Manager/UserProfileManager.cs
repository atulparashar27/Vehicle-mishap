using ODPortalWebDL.DataAccess;
using ODPortalWebDL.DTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace ODPortalWebDL.Manager
{
    public class UserProfileManager
    {
        private readonly UserProfileDataAccess _userProfileDataAccess;
        public UserProfileManager()
        {
            _userProfileDataAccess = new UserProfileDataAccess();
        }

        public UserProfileModal GetProfileData(string uidNo, string rollNo)
        {
            return _userProfileDataAccess.GetProfileData(uidNo, rollNo);
        }
    }
}
