using Microsoft.Extensions.Logging;
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
        private readonly UserManagerDataAccess _userManagerDataAccess;
        public UserManager()
        {
            _userManagerDataAccess = new UserManagerDataAccess();
        }

        public GetUserLoginObject Auth(Credentials credentials)
        {
            var date = DateTime.Now;
            //_logger.LogTrace($"@@@@@Login session@@@@ at @@@ {date} BY --->> {credentials.UserName}");
            return _userManagerDataAccess.CheckUserPassWord(credentials);
        }
    }
}
