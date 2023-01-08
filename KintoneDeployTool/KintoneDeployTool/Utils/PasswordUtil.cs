using KintoneDeployTool.Util;
using System;
using System.Security.Cryptography;
using System.Text;

namespace KintoneDeployTool.Utils
{
    public static class PasswordUtil
    {
        #region AES関連
        /// <summary>
        /// AES暗号化
        /// </summary>
        /// <param name="src">暗号化対象</param>
        /// <returns>暗号化文字BASE64</returns>
        public static string EncryptAES(string src)
        {
            AesManaged aes = GetAesManaged();
            byte[] byteText = Encoding.Unicode.GetBytes(src);
            return Convert.ToBase64String(aes.CreateEncryptor().TransformFinalBlock(byteText, 0, byteText.Length));
        }

        /// <summary>
        /// AES復号化
        /// </summary>
        /// <param name="text">複号化対象</param>
        /// <returns>暗号化文字BASE64</returns>
        public static string DecryptAES(string text)
        {
            if (string.IsNullOrEmpty(text))
            {
                return string.Empty;
            }

            AesManaged aes = GetAesManaged();
            byte[] src = Convert.FromBase64String(text);
            using (ICryptoTransform decrypt = aes.CreateDecryptor())
            {
                return Encoding.Unicode.GetString(decrypt.TransformFinalBlock(src, 0, src.Length));
            }
        }

        /// <summary>
        /// AesManaged生成
        /// </summary>
        /// <returns>AesManaged</returns>
        private static AesManaged GetAesManaged()
        {
            const string AesIV = @"ArDh6z|!%cH(VYTu";

            return new AesManaged
            {
                KeySize = 256,
                BlockSize = 128,
                Mode = CipherMode.CBC,
                IV = Encoding.UTF8.GetBytes(AesIV),
                Key = Encoding.UTF8.GetBytes(AppSetting.Instance.AesKey),
                Padding = PaddingMode.PKCS7
            };
        }

        #endregion
    }
}