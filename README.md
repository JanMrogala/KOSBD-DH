# KOSBD Diffie-Hellman

## Návod (basic flow):

1. Definování proměnných pro provedení algoritmu Diffie-Hellman
    - Uživatel nastaví tajné klíče pro obě strany (a, b)
    - Nastaví Mod **p** (musí být prvočíslo) a Base **g**, což musí být primitivní kořen modula **p**
    - *Uživatel má možnost automaticky generovat náhodné hodnoty pro **p** a **g***


2. Potvrzení a kontrola uživatelem vložených proměnných a výpočet veřejných klíčů **A** a **B**
    - Uživatel potvrzuje tlačítkem **Next step**
    - Zkontroluje se zda čísla **p** a **g** jsou korektní
    - Zkontroluje se správnost i ostatních proměnných
    - Vypočítá se hodnota veřejných klíčů **A** a **B**

3. Následující krok, ve kterém se vypočítá sdílený tajný klíč
    - Uživatel pokračuje tlačítkem **Next step**
    - Dojde k výměně veřejných klíčů **A** a **B** mezi oběma stranami
    - Obě strany si vypočítají sdílený tajný klíč, který je využit k šifrování zpráv

4. Výměna zpráv mezi stranami
    - Uživatel může vepsat zprávu a poslat ji druhé straně v zašifrované formě
    - Strana která dostává zprávu ji dešifruje a zobrazuje

</br></br>
## Způsob šifrování
Použité šifrování je velmi jednoduché. Jedná se o posunutí znaku (jeho číselné hodnoty v UTF8) o počet daný klíčem.
Dešifrování je analogické, od zašifrovaného znaku se klíč odečte.
</br></br>

## Dokumentace zásadních funkcí v programu

funkce _encodeText_ se stará o zakódování textu.

- **vstup:** text, šifrovací klíč
- **výstup:** zašifrovaný text

```
function encodeText(text, key) {
  let ret = "";
  let a;
  let value;
  for (let i = 0; i < text.length; i++) {
    value = (text.charCodeAt(i) + key) % max;
    a = String.fromCharCode(value);
    ret = ret.concat(a);
  }
  return ret;
}
```
</br></br></br>

funkce _decodeText_ se stará o dekódování textu.

- **vstup:** text, šifrovací klíč
- **výstup:** dešifrovaný text

```
function decodeText(text, key) {
  let ret = "";
  let a;
  let value;
  for (let i = 0; i < text.length; i++) {
    value = text.charCodeAt(i) - key;
    if (value < 0) value = value + max;
    a = String.fromCharCode(value);
    ret = ret.concat(a);
  }
  return ret;
}
```
</br></br></br>

funkce _isPrime_ ověřuje, zda je číslo prvočíslo.

- **vstup:** číslo
- **výstup:** true pokud je n prvočíslo, jinak false

```
function isPrime(n) {
  if (n <= 1) return false;
  if (n <= 3) return true;

  if (n % 2 == 0 || n % 3 == 0) return false;

  for (let i = 5; i * i <= n; i = i + 6)
    if (n % i == 0 || n % (i + 2) == 0) return false;

  return true;
}
```
</br></br></br>

funkce _findPrimefactors_ pomocná funkce, která nalezne primitivní kořeny čísla n.

- **vstup:** pole kde se čísla uloží, číslo
- **výstup:** pole s primitivními kořeny

```
function findPrimefactors(s, n) {
  while (n % 2 == 0) {
    s.add(2);
    n = n / 2;
  }

  for (let i = 3; i <= Math.sqrt(n); i = i + 2) {
    while (n % i == 0) {
      s.add(i);
      n = n / i;
    }
  }

  if (n > 2) s.add(n);
}
```
</br></br></br>

funkce _findPrimitive_ tato funkce nalezne nejmenší primitivní kořen čísla

- **vstup:** číslo
- **výstup:** nejmenší primitivní kořen

```
function findPrimitive(n) {
  let s = new Set();

  if (isPrime(n) == false) return -1;
  
  let phi = n - 1;

  findPrimefactors(s, phi);
  
  for (let r = 2; r <= phi; r++) {
    let flag = false;
    for (let it of s) {
      if (power(r, phi / it, n) == 1) {
        flag = true;
        break;
      }
    }

    if (flag == false) return r;
  }
  return -1;
}
```
</br></br></br>

funkce _isPrimitive_ tato funkce nalezne nejmenší primitivní kořen čísla

- **vstup:** číslo n, číslo m
- **výstup:** true pokud je n primitivní kořen čísla m, jinak false

```
function isPrimitive(n, m) {
  let s = new Set();

  if (isPrime(n) == false) return false;
  
  let phi = n - 1;

  findPrimefactors(s, phi);

  for (let r = 2; r <= phi; r++) {
    let flag = false;
    for (let it of s) {
      if (power(r, phi / it, n) == 1) {
        flag = true;
        break;
      }
    }
    if (flag == false && r == m) return true;
  }
  return false;
}
```
</br></br></br>

funkce _eratosthenes_ tato funkce nalezne všechny prvočísla až po dané číslo n
- **vstup:** číslo
- **výstup:** pole prvočísel

```
function eratosthenes(n) {
  var array = [],
    upperLimit = Math.sqrt(n),
    output = [];

  for (var i = 0; i < n; i++) {
    array.push(true);
  }

  for (var i = 2; i <= upperLimit; i++) {
    if (array[i]) {
      for (var j = i * i; j < n; j += i) {
        array[j] = false;
      }
    }
  }

  for (var i = 2; i < n; i++) {
    if (array[i]) {
      output.push(i);
    }
  }

  return output;
}
```
</br></br></br>

funkce _calculatePublicKeys_ tato funkce nastaví a vypočítá veřejné klíče

```
function calculatePublicKeys() {
  A = BigInt(g) ** BigInt(a) % BigInt(p);
  B = BigInt(g) ** BigInt(b) % BigInt(p);

  $(alicePublicKeyResult).text("A = " + A);
  $(bobPublicKeyResult).text("B = " + B);
}
```
</br></br></br>

funkce _calculateCommonSecret_ tato funkce nastaví a vypočítá sdílené tajné klíče

```
function calculateCommonSecret() {
  s1 = Number(((BigInt(B) ** BigInt(a) % BigInt(p)) + BigInt(p)) % BigInt(p));
  s2 = Number(((BigInt(A) ** BigInt(b) % BigInt(p)) + BigInt(p)) % BigInt(p));

  $(aliceCommonSecretResult).text("s = " + s1);
  $(bobCommonSecretResult).text("s = " + s2);
}
```
</br></br></br>

funkce _sendMessageFromAliceToBob_ tato funkce zašifruje zprávu od Alice a posílá ji Bobovi, který ji dešifruje

```
function sendMessageFromAliceToBob() {
  messageFromAlice = $(aliceMessageInput).val();
  encodedMsgFromAlice = encodeText(messageFromAlice, s1);
  decodedMsgFromAlice = decodeText(encodedMsgFromAlice, s2);

  $(bobReceivedMessage).text(encodedMsgFromAlice);
  $(bobDecodedMessage).text(decodedMsgFromAlice);
}
```
</br></br></br>
