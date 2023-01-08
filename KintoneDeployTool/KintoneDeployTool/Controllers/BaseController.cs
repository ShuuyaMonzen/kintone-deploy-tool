using KintoneDeployTool.WorkerServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Logging;
using System;

namespace KintoneDeployTool.Controllers
{

    public abstract class BaseController<WorkerService> : Controller where WorkerService : BaseWorkerService
    {
        public WorkerService Service { get; set; }

        public HttpContext BaseHttpContext { get; set; }

        public BaseController(IHttpContextAccessor httpContextAccessor, WorkerService service)
        {
            BaseHttpContext = httpContextAccessor.HttpContext;
            Service = service;
            Service.SetHttpContext(BaseHttpContext);
        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            Service.ModelState = this.ModelState;
        }
    }
}
