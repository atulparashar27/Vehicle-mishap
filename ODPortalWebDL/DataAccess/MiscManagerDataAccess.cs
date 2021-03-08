using Newtonsoft.Json;
using ODPortalWebDL.Constants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using static ODPortalWebDL.DTO.MiscModal;

namespace ODPortalWebDL.DataAccess
{
    public class MiscManagerDataAccess
    {
        private readonly DbConnection _dbConnection;
        public MiscManagerDataAccess()
        {
            _dbConnection = new DbConnection();
        }

        public List<LocalityList> GetLocalityLists()
        {
            var tableResponse = JsonConvert.SerializeObject(_dbConnection.GetModelDetails(RawSQL.GetLocalityLists()));
            return JsonConvert.DeserializeObject<List<LocalityList>>(tableResponse);
        }

        internal List<LocalityPeople> GetLocalityPeople(int localityId)
        {
            var tableResponse = JsonConvert.SerializeObject(_dbConnection.GetModelDetails(RawSQL.GetLocalityPeople(localityId)));
            return JsonConvert.DeserializeObject<List<LocalityPeople>>(tableResponse);
        }
    }
}
