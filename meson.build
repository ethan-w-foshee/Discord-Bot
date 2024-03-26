project('StarBot', 'c',
  version : '0.0.1',
  default_options : ['warning_level=3'])

add_project_arguments('-DBOT_TOKEN="'+get_option('BOT_TOKEN')+'"', language : 'c')

executable('starbot',
           'src/main.c',
           dependencies : [
              dependency('libcurl'),
              dependency('concord')
           ],
           install : true)
