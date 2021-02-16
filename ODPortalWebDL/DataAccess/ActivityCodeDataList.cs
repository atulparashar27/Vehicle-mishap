using ODPortalWebDL.Constants;
using ODPortalWebDL.DTO;
using ODPortalWebDL.Manager;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace ODPortalWebDL.DataAccess
{
    public class ActivityCodeDataList
    {
        private readonly DbConnection _dbConnection;
        public ActivityCodeDataList()
        {
            _dbConnection = new DbConnection();
        }
        internal List<AllActivityCode> GetAllActivity()
        {
            var tableResponse = _dbConnection.GetModelDetails(RawSQL.GetAllActCode());
            List<AllActivityCode> codeLists = new List<AllActivityCode>();
            foreach (DataRow dataRow in tableResponse.AsEnumerable())
            {
                var record = new AllActivityCode()
                {
                    ActId = dataRow.Field<String>("Act_cd"),
                    ActName = dataRow.Field<String>("Act_Name")
                };
                codeLists.Add(record);
            }
            return codeLists;
        }
    }
}
