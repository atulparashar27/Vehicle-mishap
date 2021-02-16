using ODPortalWebDL.DataAccess;
using ODPortalWebDL.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ODPortalWebDL.Manager
{
    public class UserManager
    {
        //private readonly ILogger<UserController> _logger;
        private readonly UserManagerDataAccess _userManagerDataAccess;
        public UserManager()
        {
            _userManagerDataAccess = new UserManagerDataAccess();
        }

        public GetUserLoginObject Auth(Credentials credentials)
        {
            return _userManagerDataAccess.CheckUserPassWord(credentials);
        }
    }
}
