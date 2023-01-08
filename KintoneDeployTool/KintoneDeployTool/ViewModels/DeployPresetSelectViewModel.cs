using Microsoft.AspNetCore.Mvc.Rendering;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace KintoneDeployTool.ViewModels
{
    public class DeployPresetSelectViewModel
    {
        [Required]
        public int? TrnDeployPresetId { get; set; }

        public List<SelectListItem> DeployPresetsSelectList { get; } = new List<SelectListItem>();
    }
}
