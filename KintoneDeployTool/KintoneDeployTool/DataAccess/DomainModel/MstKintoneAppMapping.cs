using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KintoneDeployTool.DataAccess.DomainModel
{
    [Table("MstKintoneAppMapping")]
    public class MstKintoneAppMapping
    {
        [Key]
        [Required]
        [DisplayName("Kintoneアプリ対応表ID")]
        public int MstKintoneAppMappingID { set; get; }

        [Required]
        [DisplayName("Kintoneアプリ対応表名")]
        public string MstKintoneAppMappingName { set; get; }

        [Required]
        [BindRequired]
        [DisplayName("Kintone環境ID1")]
        public int MstKintoneEnviromentID1 { set; get; }

        [DisplayName("Kintone環境ID1")]
        [ForeignKey("MstKintoneEnviromentID1")]
        public virtual MstKintoneEnviroment MstKintoneEnviroment1 { set; get; }

        [Required]
        [BindRequired]
        [DisplayName("Kintone環境ID2")]
        public int MstKintoneEnviromentID2 { set; get; }

        [DisplayName("Kintone環境ID2")]
        [ForeignKey("MstKintoneEnviromentID2")]
        public virtual MstKintoneEnviroment MstKintoneEnviroment2 { set; get; }

        [Required]
        [DisplayName("作成日時")]
        public DateTime CreatedAt { set; get; }

        [Required]
        [DisplayName("更新日時")]
        public DateTime UpdatedAt { set; get; }

        public virtual List<MstKintoneAppMappingDetail> MstKintoneAppMappingDetails { set; get; }


    }
}
