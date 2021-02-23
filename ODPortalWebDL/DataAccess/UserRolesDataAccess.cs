using Newtonsoft.Json;
using ODPortalWebDL.Constants;
using ODPortalWebDL.DTO;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;

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
            var tableResponse = JsonConvert.SerializeObject(_dbConnection.GetModelDetails(RawSQL.GetUserRolesData()));
            return JsonConvert.DeserializeObject<List<UserRolesModal>>(tableResponse);
        }

        internal List<UserRolesModal> GetUserRoles(string userName)
        {
            var tableResponse = JsonConvert.SerializeObject(_dbConnection.GetModelDetails(RawSQL.GetUserIndividualRoles(userName)));
            return JsonConvert.DeserializeObject<List<UserRolesModal>>(tableResponse);
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
