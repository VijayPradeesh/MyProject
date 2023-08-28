using System;
using System.Security.Cryptography;
using System.Text;

namespace CustomerPortal.Services.Core.Crypto
{
    
        public interface ICrypto
        {
            string Encryption(string value);
            string Decryption(string value);
        }

        public class Crypto : ICrypto
        {
            private const string _securityKey = "A@SDF@#$1AD@#IYUF12asdf2PQ@#Z#EP@W23X#SaDF#";

            public string Encryption(string value)
            {
                byte[] toEncryptedArray = UTF8Encoding.UTF8.GetBytes(value);

                MD5CryptoServiceProvider objMD5CryptoService = new MD5CryptoServiceProvider();

                byte[] securityKeyArray = objMD5CryptoService.ComputeHash(UTF8Encoding.UTF8.GetBytes(_securityKey));

                objMD5CryptoService.Clear();

                var objTripleDESCryptoService = new TripleDESCryptoServiceProvider();

                objTripleDESCryptoService.Key = securityKeyArray;

                objTripleDESCryptoService.Mode = CipherMode.ECB;

                objTripleDESCryptoService.Padding = PaddingMode.PKCS7;

                var objCrytpoTransform = objTripleDESCryptoService.CreateEncryptor();

                byte[] resultArray = objCrytpoTransform.TransformFinalBlock(toEncryptedArray, 0, toEncryptedArray.Length);

                objTripleDESCryptoService.Clear();

                return Convert.ToBase64String(resultArray, 0, resultArray.Length);
            }

            public string Decryption(string value)
            {
                byte[] toEncryptArray = Convert.FromBase64String(value);

                MD5CryptoServiceProvider objMD5CryptoService = new MD5CryptoServiceProvider();

                byte[] securityKeyArray = objMD5CryptoService.ComputeHash(UTF8Encoding.UTF8.GetBytes(_securityKey));

                objMD5CryptoService.Clear();

                var objTripleDESCryptoService = new TripleDESCryptoServiceProvider();

                objTripleDESCryptoService.Key = securityKeyArray;

                objTripleDESCryptoService.Mode = CipherMode.ECB;

                objTripleDESCryptoService.Padding = PaddingMode.PKCS7;

                var objCrytpoTransform = objTripleDESCryptoService.CreateDecryptor();

                byte[] resultArray = objCrytpoTransform.TransformFinalBlock(toEncryptArray, 0, toEncryptArray.Length);

                objTripleDESCryptoService.Clear();

                return UTF8Encoding.UTF8.GetString(resultArray);
            }
        }
}
