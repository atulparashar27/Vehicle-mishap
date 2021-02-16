using ODPortalWebDL.Constants;
using ODPortalWebDL.DTO;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace ODPortalWebDL.DataAccess
{
    public class AttendanceDataAccess
    {
        private readonly DbConnection _dbConnection;
        public AttendanceDataAccess()
        {
            _dbConnection = new DbConnection();
        }
        internal List<ActivityAttendanceModal> GetPeopleDate(string status)
        {
            var tableResponse = _dbConnection.GetModelDetails(RawSQL.GetAllPeopleList(status));
            List<ActivityAttendanceModal> peopleList = new List<ActivityAttendanceModal>();
            foreach (DataRow dataRow in tableResponse.AsEnumerable())
            {
                var record = new ActivityAttendanceModal()
                {
                    UidNo = dataRow.Field<string>("UID_No") ?? "",
                    Name = dataRow.Field<string>("Name_Full"),
                    RollNo = Convert.ToInt32(dataRow.Field<double>("Roll_No")),
                    IniJigStatus = dataRow.Field<string>("INI_JIG_NON") == "INI" ? "Initiated" 
                                    : dataRow.Field<string>("INI_JIG_NON") == "CHL" ? "Children" 
                                    : dataRow.Field<string>("INI_JIG_NON") == "OTH" ? "Other" 
                                    : dataRow.Field<string>("INI_JIG_NON") == "JIG" ? "Jigyasu" : "",
                    FamilyCode = Convert.ToInt32(dataRow.Field<double>("Family_cd"))
                };
                peopleList.Add(record);
            }
            return peopleList;
        }

        internal SavedAttendanceModal GetSavedAttendance(string actCode, DateTime actDate)
        {
            var tableResponse = _dbConnection.GetModelDetails(RawSQL.GetSavedAttendance(actCode, actDate));
            SavedAttendanceModal peopleList = new SavedAttendanceModal();
            List<SavedAttendancePeopleModal> attendPeopleList = new List<SavedAttendancePeopleModal>();
            foreach (DataRow dataRow in tableResponse.AsEnumerable())
            {
                var record = new SavedAttendancePeopleModal()
                {
                    BranchName = "OD Branch",
                    Gender = dataRow.Field<string>("Gender"),
                    Name = dataRow.Field<string>("Name_Full"),
                    IniJigStatus = dataRow.Field<string>("INI_JIG_NON") == "INI" ? "Initiated"
                                    : dataRow.Field<string>("INI_JIG_NON") == "CHL" ? "Child"
                                    : dataRow.Field<string>("INI_JIG_NON") == "OTH" ? "Other"
                                    : dataRow.Field<string>("INI_JIG_NON") == "JIG" ? "Jigyasu" : "",
                    IsSantSu = dataRow.Field<string>("Sant_su") != null ? "Y": "N",
                    UidNo = dataRow.Field<string>("UID_No") ?? ""
                };
                attendPeopleList.Add(record);
                peopleList.ActivityDate = dataRow.Field<DateTime>("Act_Date");
                peopleList.ActivityName = dataRow.Field<string>("Act_Name");
            }
            peopleList.SavedAttendancePeopleModals = attendPeopleList;
            return peopleList;
        }

        internal bool SubmitActivityAttendance(SubmitActivityAttendanceModal submitActivityAttendanceModal)
        {
            return _dbConnection.SaveActivityAttendance(submitActivityAttendanceModal);
        }
    }
}
