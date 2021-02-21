using ODPortalWebDL.Constants;
using ODPortalWebDL.DTO;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace ODPortalWebDL.DataAccess
{
    public class UserRolesDataAccess
    {
        private readonly DbConnection _dbConnection;

        //private readonly ILogger _logger;
        public UserRolesDataAccess()
        {
            //_logger = logger;
            _dbConnection = new DbConnection();
        }
        internal List<UserRolesModal> GetUserRolesData()
        {
            var tableResponse = _dbConnection.GetModelDetails(RawSQL.GetUserRolesData());
            List<UserRolesModal> rolesLists = new List<UserRolesModal>();
            foreach (DataRow dataRow in tableResponse.AsEnumerable())
            {
                var record = new UserRolesModal()
                {
                    RoleId = dataRow.Field<int>("RoleId"),
                    RoleName = dataRow.Field<String>("RoleName"),
                    RoleDesc = dataRow.Field<String>("RoleDesc")
                };
                rolesLists.Add(record);
            }
            return rolesLists;
        }

        internal List<UserRolesModal> GetUserRoles(string userName)
        {
            List<UserRolesModal> securityObjects = new List<UserRolesModal>();
            var tableResponse = _dbConnection.GetModelDetails(RawSQL.GetUserIndividualRoles(userName)).AsEnumerable();
            foreach (DataRow dataRow in tableResponse.AsEnumerable())
            {
                var obj = new UserRolesModal()
                {
                    RoleId = dataRow.Field<int>("urs.RoleId"),
                    RoleName = dataRow.Field<String>("RoleName"),
                    RoleDesc = dataRow.Field<String>("RoleDesc"),
                    AccessType = dataRow.Field<string>("AccessType")
                };
                securityObjects.Add(obj);
            }
            return securityObjects;
        }

        internal bool DeleteRoles(UserRolesModal userRolesModal)
        {
            return _dbConnection.DeleteRoles(userRolesModal) > 0 ? true : false;
        }

        internal bool UpdateRoles(UserRolesModal userRolesModal)
        {
            return _dbConnection.UpdateRoles(userRolesModal) > 0 ? true : false;
        }

        internal bool AddNewRoles(UserRolesModal userRolesModal)
        {
            return _dbConnection.AddNewRoles(userRolesModal) > 0 ? true : false;
        }

        internal bool UnassignRoles(UpdateRolesModal updateRolesModal, string action)
        {
            return _dbConnection.UnassignRoles(updateRolesModal) > 0 ? true : false;
        }

        internal bool AssignRoles(UpdateRolesModal updateRolesModal, string action)
        {
            return _dbConnection.AssignRoles(updateRolesModal) > 0 ? true : false;
        }
    }
}
