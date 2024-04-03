core_src = files(
  'anomap.c',
  'cog-utils.c',
  'curl-websocket-utils.c',
  'curl-websocket.c',
  'io_poller.c',
  'jsmn-find.c',
  'json-build.c',
  'log.c',
  'logconf.c',
  'priority_queue.c',
  'queriec.c',
  'sha1.c',
  'threadpool.c',
  'user-agent.c',
  'websockets.c',
)

core_lib = static_library('concord_core', core_src,
                          dependencies: [
                            dependency('threads'),
                          ],
                          include_directories: core_inc)
