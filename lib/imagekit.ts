import logger from './logger';

const IMAGEKIT_PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
const IMAGEKIT_PRIVATE_KEY = import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY;
const IMAGEKIT_URL_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;

async function hmacSha1(key: string, message: string): Promise<string> {
  const keyData = new TextEncoder().encode(key);
  const msgData = new TextEncoder().encode(message);
  const cryptoKey = await crypto.subtle.importKey(
    'raw', keyData, { name: 'HMAC', hash: 'SHA-1' },
    false, ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function getImageKitAuthParams(): Promise<{ token: string; expire: number; signature: string }> {
  const token = crypto.randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 1800;
  const signature = await hmacSha1(IMAGEKIT_PRIVATE_KEY, `${token}${expire}`);

  return { token, expire, signature };
}

export async function uploadToImageKit(file: File): Promise<string> {
  const auth = await getImageKitAuthParams();
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', file.name);
  formData.append('publicKey', IMAGEKIT_PUBLIC_KEY);
  formData.append('signature', auth.signature);
  formData.append('expire', String(auth.expire));
  formData.append('token', auth.token);
  formData.append('folder', '/orgasoft');

  try {
    const res = await fetch(`https://upload.imagekit.io/api/v1/files/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`ImageKit upload failed: ${res.status} - ${body}`);
    }
    const data = await res.json();
    logger.log('ImageKit upload success:', data.url);
    return data.url;
  } catch (error) {
    logger.error('ImageKit upload error:', error);
    throw error;
  }
}

export function getOptimizedUrl(src: string, opts?: { width?: number; height?: number; quality?: number; format?: string }): string {
  if (!src) return src;
  const base = IMAGEKIT_URL_ENDPOINT;
  if (src.startsWith(base)) {
    const path = src.slice(base.length);
    const transformations: string[] = [];
    if (opts?.width) transformations.push(`w-${opts.width}`);
    if (opts?.height) transformations.push(`h-${opts.height}`);
    if (opts?.quality) transformations.push(`q-${opts.quality}`);
    if (transformations.length === 0) return src;
    return `${base}/tr:${transformations.join(',')}${path}`;
  }
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//')) {
    return src;
  }
  if (src.startsWith('/')) {
    return src;
  }
  return `${base}/${src}`;
}

export function getImageKitUrl(path: string, params?: { w?: number; h?: number; q?: number }): string {
  const base = IMAGEKIT_URL_ENDPOINT;
  if (!params) return `${base}/${path}`;
  const transformations = [];
  if (params.w) transformations.push(`w-${params.w}`);
  if (params.h) transformations.push(`h-${params.h}`);
  if (params.q) transformations.push(`q-${params.q}`);
  return `${base}/tr:${transformations.join(',')}/${path}`;
}
