// Shared by the server and browser; ordinary links keep native browser history.
export const pagePaths = {home:'/', topics:'/topics', create:'/topics/new', about:'/about', ballot:'/ballot', verify:'/verify', board:'/board', agents:'/account/agents'};
export function readPage(pathname) {
  const topic = pathname.match(/^\/topic\/([a-zA-Z0-9-]+)(?:\/(verify|board))?$/);
  if (topic) return {page:topic[2] || 'ballot', topicId:topic[1]};
  const aliases = {'/index.html':'home', '/lab.html':'ballot', '/agent.html':'agents'};
  return {page:aliases[pathname] || Object.keys(pagePaths).find(page=>pagePaths[page]===pathname) || null, topicId:null};
}
export function pageHref(page, topicId=null) {
  if (topicId && ['ballot','verify','board'].includes(page)) return '/topic/'+encodeURIComponent(topicId)+(page==='ballot'?'':'/'+page);
  return pagePaths[page];
}
