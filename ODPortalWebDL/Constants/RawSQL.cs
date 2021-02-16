using ODPortalWebDL.DTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace ODPortalWebDL.Constants
{
    public static class RawSQL
    {
        public static string CheckAuth(string userName, string passWord)
        {
            return $"select * from BranchMaster " +
                    $"where UID_No='{userName}' and Date_Birth=#{passWord}# " +
                    $"and Status='CR'" ;
        }
        public static string GetAllActCode()
        {
            return $"SELECT * FROM ActivityCode";
        }

        public static string GetAllPeopleList(string status)
        {
            return $"Select * from BranchMaster where Status='{status}'";
        }

        public static string GetSavedAttendance(string actCode, DateTime actDate)
        {
            return $"select * " +
                    $"from Act2018 attend, BranchMaster branch, ActivityCode act " +
                    $"WHERE attend.Roll_NO = branch.Roll_NO " +
                    $"AND attend.Act_cd = act.Act_cd " +
                    $"AND attend.Act_cd='{actCode}' and attend.Act_Date=#{actDate}#";
        }
    }
}
