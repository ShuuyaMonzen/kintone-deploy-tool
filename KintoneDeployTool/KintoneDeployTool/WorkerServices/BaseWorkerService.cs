using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace KintoneDeployTool.WorkerServices
{
    public abstract class BaseWorkerService
    {
        public void SetHttpContext(HttpContext context)
        {
            HttpContext = context;
            Session = HttpContext?.Session;
        }

        public ModelStateDictionary ModelState { get; set; }

        /// <summary>
        /// HttpContext
        /// </summary>
        public HttpContext HttpContext { get; set; }

        /// <summary>
        /// セッション
        /// </summary>
        public ISession Session { get; set; }
    }
}