// The HTML download attribute is ignored for cross-origin links. Blob provides
// an explicit download query; existing same-origin asset URLs stay unchanged.
export function assetDownloadUrl(value: string) {
  try {
    const url = new URL(value);
    if (
      url.protocol === "https:" &&
      /^[a-z0-9]+\.public\.blob\.vercel-storage\.com$/.test(url.hostname)
    ) {
      url.searchParams.set("download", "1");
      return url.toString();
    }
  } catch {}
  return value;
}
