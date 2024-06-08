export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    url.host = 'voice.oaifree.com';
    return fetch(new Request(url, request));
  }
}
