using Microsoft.Extensions.Logging;
using ODPortalWebDL.Constants;
using ODPortalWebDL.DTO;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace ODPortalWebDL.DataAccess
{
    public class UserManagerDataAccess
    {
        private readonly DbConnection _dbConnection;
        //private readonly ILogger _logger;
        public UserManagerDataAccess()
        {
            _dbConnection = new DbConnection();
            
        }
        internal GetUserLoginObject CheckUserPassWord(Credentials credentials)
        {
            List<SecurityObjects> rolesDetailsLists = new List<SecurityObjects>();
            for (int i = 1; i < 11; i++)
            {
                rolesDetailsLists.Add(new SecurityObjects() { RoleId = i, AccessType = "Write" });
            }
            var tableResponse = _dbConnection.GetModelDetails(RawSQL.CheckAuth(credentials.UserName, credentials.Password));
            //_logger.LogTrace("Login ------- Table fething");
            var tableRow = tableResponse.AsEnumerable().FirstOrDefault();
            if (tableRow != null)
            {
                var record = new GetUserLoginObject()
                {
                    UserName = tableRow.Field<dynamic>("Name_Full"),
                    Password = Convert.ToDateTime(tableRow.Field<DateTime>("Date_Birth")).ToString("yyyy-MM-dd"),
                    RollNo = Convert.ToInt32(tableRow.Field<dynamic>("Roll_No")),
                    UidNo = tableRow.Field<dynamic>("UID_No") ?? "",
                    RolesDetailsList = rolesDetailsLists
                };
                if (record.UidNo == credentials.UserName && record.Password == credentials.Password)
                {
                    return record;
                }
                else
                {
                    return new GetUserLoginObject();
                }
            }
            else
            {
                return new GetUserLoginObject();
            }
        }
    }
}
