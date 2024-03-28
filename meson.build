project('StarBot', 'c',
  version : '0.0.1',
  default_options : ['warning_level=3',
                     'prefer_static=true',
                     'default_library=static'])

add_project_arguments('-DBOT_TOKEN="'+get_option('BOT_TOKEN')+'"', language : 'c')

starbot_src = [ ]

subdir('./src')

executable('starbot',
           starbot_src,
           dependencies : [
              dependency('libcurl'),
              dependency('concord')
           ],
           install : true)
