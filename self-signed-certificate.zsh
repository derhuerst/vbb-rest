openssl genrsa -des3 -out server.pass.key 2048
openssl rsa -in server.pass.key -out server.key
openssl req -new -key server.key -out server.csr
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt

echo "SHA1 fingerprint:\n"
openssl x509 -in server.crt -sha1 -noout -fingerprint

rm server.pass.key
rm server.csr
