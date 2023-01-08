using Microsoft.AspNetCore.Mvc;

namespace KintoneDeployTool.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
