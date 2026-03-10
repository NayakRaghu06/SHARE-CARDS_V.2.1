import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';
import { File, Paths } from 'expo-file-system';

const shareCardAsVCard = async (cardData = {}) => {
  try {
    const v = cardData || {};
    let vcard = 'BEGIN:VCARD\r\nVERSION:3.0\r\n';
    if (v.name) vcard += `FN:${v.name}\r\n`;
    if (v.name) {
      const parts = v.name.split(' ');
      const last = parts.length > 1 ? parts.pop() : '';
      const first = parts.join(' ');
      vcard += `N:${last};${first};;;\r\n`;
    }
    if (v.companyName || v.company) vcard += `ORG:${v.companyName || v.company}\r\n`;
    if (v.designation || v.role) vcard += `TITLE:${v.designation || v.role}\r\n`;
    if (v.phone) vcard += `TEL;TYPE=CELL:${v.phone}\r\n`;
    if (v.whatsapp) vcard += `TEL;TYPE=WHATSAPP:${v.whatsapp}\r\n`;
    if (v.email) vcard += `EMAIL;TYPE=INTERNET:${v.email}\r\n`;
    if (v.website) vcard += `URL:${v.website}\r\n`;
    if (v.address) vcard += `ADR:;;${v.address};;;;\r\n`;

    // NOTE: Embedding images in vCard is optional and can make the file large.
    // If image URIs are provided and are local file:// or cache URIs, try to read base64.
    const ENC_BASE64 = 'base64';
    const ENC_UTF8 = 'utf8';

    const tryEmbed = async (uri) => {
      try {
        if (!uri) return null;

        let f;
        if (uri.startsWith('http')) {
          // download remote file to cache then read
          try {
            const dest = new File(Paths.cache, `tmp_${Date.now()}`);
            // File.downloadFileAsync returns a File instance (or throws)
            f = await File.downloadFileAsync(uri, dest);
          } catch (e) {
            return null;
          }
        } else {
          // local uri or file://
          try {
            f = new File(uri);
          } catch (e) {
            return null;
          }
        }

        try {
          const b64 = await f.base64();
          return b64;
        } catch (e) {
          return null;
        }
      } catch (e) {
        return null;
      }
    };

    const photoB64 = await tryEmbed(v.profileImage || v.photo || v.avatar);
    const logoB64 = await tryEmbed(v.companyLogo || v.logo);

    const foldBase64 = (b64) => {
      if (!b64) return '';
      const width = 76;
      const parts = [];
      for (let i = 0; i < b64.length; i += width) parts.push(b64.slice(i, i + width));
      return parts.join('\r\n');
    };

    if (photoB64) {
      vcard += `PHOTO;ENCODING=BASE64;TYPE=JPEG:\r\n`;
      vcard += foldBase64(photoB64) + '\r\n';
    } else if (v.profileImage && String(v.profileImage).startsWith('http')) {
      vcard += `PHOTO;VALUE=URI:${v.profileImage}\r\n`;
    }
    if (logoB64) {
      vcard += `LOGO;ENCODING=BASE64;TYPE=JPEG:\r\n`;
      vcard += foldBase64(logoB64) + '\r\n';
    } else if (v.companyLogo && String(v.companyLogo).startsWith('http')) {
      vcard += `LOGO;VALUE=URI:${v.companyLogo}\r\n`;
    }

    // Add business category if present (standard vCard field)
    if (v.businessCategory || v.category) {
      vcard += `CATEGORIES:${v.businessCategory || v.category}\r\n`;
    }

    // Add any remaining fields as X- properties so nothing is lost
    const reserved = new Set(['name','profileImage','photo','avatar','companyName','company','companyLogo','logo','designation','role','phone','whatsapp','email','website','address','businessCategory','category']);
    for (const [k, val] of Object.entries(v)) {
      if (!val) continue;
      if (reserved.has(k)) continue;
      const safe = typeof val === 'object' ? JSON.stringify(val) : String(val);
      // sanitize newlines
      const encoded = safe.replace(/\r?\n/g, ' ');
      vcard += `X-${k.toUpperCase()}:${encoded}\r\n`;
    }

    vcard += 'END:VCARD\r\n';

    // Create file using new File API
    const file = new File(Paths.cache, `card_${Date.now()}.vcf`);
    try {
      // create parent and write
      file.write(vcard, { encoding: ENC_UTF8 });
    } catch (e) {
      // fallback: try creating then writing
      try {
        file.create({ intermediates: true, overwrite: true });
        file.write(vcard, { encoding: ENC_UTF8 });
      } catch (err) {
        throw err;
      }
    }
    const path = file.uri;

    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) {
      Alert.alert('Share not available', 'Sharing is not available on this device.');
      return;
    }

    // On Android sharing a file:// uri is fine; on iOS it's also fine from cacheDirectory
    await Sharing.shareAsync(path, { mimeType: 'text/x-vcard' });
  } catch (error) {
    console.log('shareCardAsVCard error', error);
    Alert.alert('Error', error?.message || String(error));
  }
};

export default shareCardAsVCard;
