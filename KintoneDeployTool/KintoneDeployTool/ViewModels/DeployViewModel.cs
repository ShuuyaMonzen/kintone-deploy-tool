using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace KintoneDeployTool.ViewModels
{
    public class DeployViewModel
    {
        [Required]
        public int? TrnDeployPresetId { get; set; }

        public string PresetName { get; set; }

        public string UrlKind { get; set; }

        public string LogMessage { get; set; }
    }
}
