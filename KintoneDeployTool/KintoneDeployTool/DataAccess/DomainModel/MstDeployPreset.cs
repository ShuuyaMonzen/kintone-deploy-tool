using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KintoneDeployTool.DataAccess.DomainModel
{
    [Table("TrnDeployPreset")]
    public class MstDeployPreset
    {
        [Key]
        [Required]
        [DisplayName("デプロイ情報プリセットID")]
        public int MstDeployPresetId { set; get; }

        [Required]
        [DisplayName("プリセット名")]
        public string PresetName { set; get; }

        [DisplayName("Kintoneアプリ対応表ID")]
        public int? MstKintoneAppMappingID { set; get; }

        [ForeignKey("MstKintoneAppMappingID")]
        public virtual MstKintoneAppMapping MstKintoneAppMapping { set; get; }

        [Required]
        [DisplayName("作成日時")]
        public DateTime CreatedAt { set; get; }

        [Required]
        [DisplayName("更新日時")]
        public DateTime UpdatedAt { set; get; }

        public virtual List<MstDeployFromToInfo> MstDeployFromToInfos { set; get; }
    }
}
