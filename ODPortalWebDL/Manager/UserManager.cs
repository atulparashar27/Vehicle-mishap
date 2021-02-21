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
        private readonly ILogger<UserManager> _logger;
        private readonly UserManagerDataAccess _userManagerDataAccess;
        public UserManager()
        {
            ILoggerFactory loggerFactory = new LoggerFactory();
            _logger = loggerFactory.CreateLogger<UserManager>();
            _userManagerDataAccess = new UserManagerDataAccess();
        }

        public GetUserLoginObject Auth(Credentials credentials)
        {
            var date = DateTime.Now;
            _logger.LogInformation($"@@@@@Login session@@@@ at @@@ {date} BY --->> {credentials.UserName}");
            return _userManagerDataAccess.CheckUserPassWord(credentials);
        }
    }
}
