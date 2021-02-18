using Microsoft.Extensions.Logging;
using ODPortalWebDL.Constants;
using ODPortalWebDL.DTO;
using ODPortalWebDL.DTO.ExceptionModal;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Text;

namespace ODPortalWebDL.DataAccess
{
    public class UserManagerDataAccess
    {
        private readonly DbConnection _dbConnection;
        private readonly ILogger _logger;
        public UserManagerDataAccess()
        {
            ILoggerFactory loggerFactory = new LoggerFactory();
            _logger = loggerFactory.CreateLogger<DbConnection>();
            _dbConnection = new DbConnection();
            
        }
        internal GetUserLoginObject CheckUserPassWord(Credentials credentials)
        {
            _logger.LogInformation($"$$$$$$ --- USER----{credentials.UserName} ----------$$$$$$$$$");
            List<SecurityObjects> rolesDetailsLists = new List<SecurityObjects>();
            for (int i = 1; i < 11; i++)
            {
                rolesDetailsLists.Add(new SecurityObjects() { RoleId = i, AccessType = "Write" });
            }
            var tableResponse = _dbConnection.GetModelDetails(RawSQL.CheckAuth(credentials.UserName, credentials.Password));
            _logger.LogInformation("Login ------- Table fething");
            var tableRow = tableResponse.AsEnumerable().FirstOrDefault();
            if (tableRow != null)
            {
                var record = new GetUserLoginObject()
                {
                    UserName = tableRow.Field<string>("Name_Full"),
                    Password = Convert.ToDateTime(tableRow.Field<DateTime>("Date_Birth")).ToString("yyyy-MM-dd"),
                    RollNo = Convert.ToInt32(tableRow.Field<double>("Roll_No")),
                    UidNo = tableRow.Field<string>("UID_No") ?? "",
                    RolesDetailsList = rolesDetailsLists
                };
                if (record.UidNo == credentials.UserName && record.Password == credentials.Password)
                {
                    return record;
                }
                else
                {
                    throw new CustomException("Invalid Login details entered.", HttpStatusCode.OK);
                }
            }
            else
            {
                throw new CustomException("Invalid Login details entered.", HttpStatusCode.OK);
            }
        }
    }
}
