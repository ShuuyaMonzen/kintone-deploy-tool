using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KintoneDeployTool.DataAccess.DomainModel
{
    [Table("MstKintoneAppMappingDetail")]
    public class MstKintoneAppMappingDetail
    {
        [Key]
        [Required]
        [DisplayName("Kintoneアプリ対応表詳細ID")]
        public int MstKintoneAppMappingDetailID { set; get; }

        [Required]
        [DisplayName("Kintoneアプリ対応表ID")]
        public int MstKintoneAppMappingID { set; get; }

        [ForeignKey("MstKintoneAppMappingID")]
        public virtual MstKintoneAppMapping MstKintoneAppMapping { set; get; }

        [Required]
        [BindRequired]
        [DisplayName("KintoneアプリマスタID1")]
        public int MstKintoneAppID1 { set; get; }

        [ForeignKey("MstKintoneAppID1")]
        public virtual MstKintoneApp MstKintoneApp1 { set; get; }

        [Required]
        [BindRequired]
        [DisplayName("KintoneアプリマスタID2")]
        public int MstKintoneAppID2 { set; get; }

        [ForeignKey("MstKintoneAppID2")]
        public virtual MstKintoneApp MstKintoneApp2 { set; get; }

        [Required]
        [DisplayName("作成日時")]
        public DateTime CreatedAt { set; get; }

        [Required]
        [DisplayName("更新日時")]
        public DateTime UpdatedAt { set; get; }

        
    }
}
