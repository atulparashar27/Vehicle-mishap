using System;
using System.Collections.Generic;
using System.Net;
using System.Text;

namespace ODPortalWebDL.DTO.ExceptionModal
{
    public class CustomException: Exception
    {
        public HttpStatusCode Status { get; set; }
        public CustomException(string msg, HttpStatusCode status = HttpStatusCode.OK) : base(msg)
        {
            Status = status;
        }
    }
}
