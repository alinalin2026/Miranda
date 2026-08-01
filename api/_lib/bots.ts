// Matches known bots, crawlers, link-preview fetchers, and common HTTP
// client libraries. These hit a /go/ link over plain HTTP without ever
// running JS, so they'd never show up in Google Analytics -- but they do
// show up here unless filtered, which is why the two numbers can diverge
// wildly. This list is deliberately broad: a link preview fetch is exactly
// as "not a real visitor" as a scraper is.
const BOT_UA_PATTERN =
  /bot|crawl|spider|slurp|mediapartners|facebookexternalhit|pinterest|whatsapp|telegrambot|discordbot|slackbot|twitterbot|linkedinbot|embedly|quora|outbrain|w3c_validator|semrush|ahrefs|mj12bot|dotbot|python-requests|curl\/|wget\/|go-http-client|okhttp|libwww-perl|headlesschrome|phantomjs|puppeteer|node-fetch|axios\/|scrapy|httpclient|java\/|apache-httpclient|postman/i;

export function isLikelyBot(userAgent: string): boolean {
  if (!userAgent) return true; // no UA at all is itself a strong bot signal
  return BOT_UA_PATTERN.test(userAgent);
}
