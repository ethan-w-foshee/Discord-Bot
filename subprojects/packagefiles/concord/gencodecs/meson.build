cc = meson.get_compiler('c', native: true)
cpp_flags = [
  '-E', '-P', '-nostdinc'
]

codec_dflags = [
  '-DGENCODECS_INIT',
  '-DGENCODECS_JSON_ENCODER',
  '-DGENCODECS_JSON_DECODER',
]

pp = executable('gencodecs_pp',
                './gencodecs-pp.c',
                native: true)
cat = executable('gencodecs_cat',
                 './gencodec_cat.c',
                 native: true)

api_inc = include_directories('./api')
codec_inc = include_directories('.')
core_inc = include_directories('../core')
concord_inc = include_directories('../include')

preprocess_incs = [codec_inc, api_inc, core_inc, concord_inc]

codec_basename = 'discord_codecs'
codec_src_in = codec_basename + '.PRE.h'
codec_src_proc1_c = codec_basename + '.PROC1.c'
codec_src_proc2_c = codec_basename + '.PROC2.c'
codec_src_proc1_h = codec_basename + '.PROC1.h'
codec_src_proc2_h = codec_basename + '.PROC2.h'
codec_src_c = codec_basename + '.c'
codec_src_h = codec_basename + '.h'

# Meson 1.3.2+ support using cc.preprocess compile_args, versions before don't work
codec_proc1_h = cc.preprocess(codec_src_in,
                              output: codec_src_proc1_h,
                              compile_args: cpp_flags + ['-DGENCODECS_HEADER', '-DGENCODECS_DATA'],
                              include_directories: preprocess_incs)
codec_proc2_h = cc.preprocess(codec_src_in,
                              output: codec_src_proc2_h,
                              compile_args: cpp_flags + codec_dflags + ['-DGENCODECS_HEADER'],
                              include_directories: preprocess_incs)
codec_pp1_h = custom_target(codec_src_h+'.pp1',
                            output: codec_src_h+'.pp1',
                            input: codec_proc1_h,
                            command: [pp],
                            feed: true,
                            capture: true)
codec_pp2_h = custom_target(codec_src_h+'.pp2',
                            output: codec_src_h+'.pp2',
                            input: codec_proc2_h,
                            command: [pp],
                            feed: true,
                            capture: true)

codec_h = custom_target(codec_src_h,
                        output: codec_src_h,
                        command: [cat, '#ifndef DISCORD_CODECS_H', '#define DISCORD_CODECS_H', codec_pp1_h, codec_pp2_h, '#endif', '@OUTPUT@'],
                        install: true,
                        install_dir: get_option('includedir') + '/' + concord_inc_path,
                        install_tag: 'devel')

codec_proc1_c = cc.preprocess(codec_src_in,
                              output: codec_src_proc1_c,
                              compile_args: cpp_flags + codec_dflags + ['-DGENCODECS_FORWARD', '-DGENCODECS_DATA'],
                              include_directories: preprocess_incs)
codec_proc2_c = cc.preprocess(codec_src_in,
                              output: codec_src_proc2_c,
                              compile_args: cpp_flags + codec_dflags + ['-DGENCODECS_DATA'],
                              include_directories: preprocess_incs)
codec_pp1_c = custom_target(codec_src_c+'.pp1',
                            output: codec_src_c+'.pp1',
                            input: codec_proc1_c,
                            command: [pp],
                            feed: true,
                            capture: true)
codec_pp2_c = custom_target(codec_src_c+'.pp2',
                            output: codec_src_c+'.pp2',
                            input: codec_proc2_c,
                            command: [pp],
                            feed: true,
                            capture: true)

codec_c = custom_target(codec_src_c,
                        output: codec_src_c,
                        command: [cat, '#include "'+codec_src_h+'"', codec_pp1_c, codec_pp2_c, '@OUTPUT@'])

concord_src += [
  codec_h,
  codec_c,
]

