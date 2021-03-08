using ODPortalWebDL.DataAccess;
using System;
using System.Collections.Generic;
using System.Text;
using static ODPortalWebDL.DTO.MiscModal;

namespace ODPortalWebDL.Manager
{
    public class MiscManager
    {
        private readonly MiscManagerDataAccess _miscManagerDataAccess;
        public MiscManager()
        {
            _miscManagerDataAccess = new MiscManagerDataAccess();
        }

        public List<LocalityList> GetLocalityLists()
        {
            return _miscManagerDataAccess.GetLocalityLists();
        }

        public List<LocalityPeople> GetLocalityPeople(int localityId)
        {
            return _miscManagerDataAccess.GetLocalityPeople(localityId);
        }
    }
}
