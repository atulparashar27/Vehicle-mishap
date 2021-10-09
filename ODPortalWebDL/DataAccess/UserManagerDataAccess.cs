using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
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
            _logger.LogTrace($"$$$$$$ --- USER----{credentials.UserName} ----------$$$$$$$$$");
            var checkPassword = _dbConnection.GetModelDetails(RawSQL.GetAllUserPassword(credentials.UserName));
            var checkSecurity = checkPassword.AsEnumerable().FirstOrDefault();
            if (checkSecurity != null)
            {
                if (checkSecurity.Field<string>("UserName").Trim() == credentials.UserName &&
                checkSecurity.Field<string>("Password").Trim() == credentials.Password)
                {
                    var tableResponse = _dbConnection.GetModelDetails(RawSQL.CheckAuth(credentials.UserName, credentials.Password));
                    var tableRow = tableResponse.AsEnumerable().FirstOrDefault();
                    if (tableRow != null)
                    {
                        var record = new GetUserLoginObject()
                        {
                            UserName = tableRow.Field<string>("Name_Full"),
                            RollNo = Convert.ToInt32(tableRow.Field<double>("Roll_No")),
                            UidNo = tableRow.Field<string>("UID_No") ?? "",
                            RolesDetailsList = GetUserRoles(credentials.UserName)
                        };
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
            else
            {
                throw new CustomException("Invalid Login details entered.", HttpStatusCode.OK);
            }
        }


        internal List<SecurityObjects> GetUserRoles(string userName)
        {
            var tableRes = JsonConvert.SerializeObject(_dbConnection.GetModelDetails(RawSQL.GetAllUserRoles(userName)));
            return JsonConvert.DeserializeObject<List<SecurityObjects>>(tableRes);
        }
    }
}
