using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ODPortalDL.DTO;
using ODPortalWebDL.DTO.ExceptionModal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ODPortalWebAPI.ExceptionHandler
{
    [ApiExplorerSettings(IgnoreApi = true)]
    public class ErrorsController : ControllerBase
    {
        [Route("error")]
        public RequestResult<string> Error()
        {
            var context = HttpContext.Features.Get<IExceptionHandlerFeature>();
            var exception = context.Error; // Your exception
            var code = 500; // Internal Server Error by default

            if (exception is CustomException customException)
            {
                code = (int)customException.Status;
            }

            Response.StatusCode = code; // You can use HttpStatusCode enum instead

            var result = new RequestResult<string>()
            {
                Success = false,
                Data = "",
                Message = exception.Message
            };
            return result; // Your error model
        }
    }
}
