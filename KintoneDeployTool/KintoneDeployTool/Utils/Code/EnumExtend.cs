using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KintoneDeployTool.Utils.Code
{
    public static partial class EnumExtend
    {
        /// <summary>
        /// 列挙型から対応する数値を文字列化したものを返す
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        public static string GetValueString(this Enum param)
        {
            return GetValue(param).ToString();
        }

        /// <summary>
        /// 列挙型から対応する数値を返す
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        public static int GetValue(this Enum param)
        {
            return Convert.ToInt32(param);
        }

        /// <summary>
        /// 文字列(コード値,数値)を列挙型に変換したものを返す
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        public static T GetEnumFromCodeValue<T>(this string param) where T : Enum
        {
            if (string.IsNullOrEmpty(param))
            {
                throw new ArgumentException("NULLはコード列挙型変換できません");
            }
            return (T)Enum.ToObject(typeof(T), int.Parse(param));
        }

        /// <summary>
        /// StringValueAttributeの設定値を返す。
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static string GetEnumNameValue(this Enum value)
        {
            // Get the type
            Type type = value.GetType();

            // Get fieldinfo for this type
            System.Reflection.FieldInfo fieldInfo = type.GetField(value.ToString());

            //範囲外の値チェック
            if (fieldInfo == null) return null;

            EnumNameAttribute[] attribs = fieldInfo.GetCustomAttributes(typeof(EnumNameAttribute), false) as EnumNameAttribute[];

            // Return the first if there was a match.
            return attribs.Length > 0 ? attribs[0].StringValue : null;

        }
    }

    /// <summary>
    /// Enumに文字列を付加するためのAttributeクラス
    /// </summary>
    public class EnumNameAttribute : Attribute
    {
        /// <summary>
        /// Holds the stringvalue for a value in an enum.
        /// </summary>
        public string StringValue { get; protected set; }

        /// <summary>
        /// Constructor used to init a StringValue Attribute
        /// </summary>
        /// <param name="value"></param>
        public EnumNameAttribute(string value)
        {
            this.StringValue = value;
        }
    }
}
