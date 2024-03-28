#ifndef STARBOT_COMMANDS_H
#define STARBOT_COMMANDS_H

#include "discord.h"
#include "discord_codecs.h"
#include <string.h>
#include <log.h>

#ifndef DISCORD_TOKEN
#define GET_DISCORD_TOKEN() getenv("DISCORD_TOKEN")
#else
#define GET_DISCORD_TOKEN() DISCORD_TOKEN
#endif

#define INTERACTION_CREATE(str, int_description, int_type, int_options) struct discord_create_global_application_command params_##str##_##int_type = { \
    .name = #str,							\
    .description = int_description,					\
    .type = int_type,							\
    .options = int_options,						\
  };									\
  log_debug("Creating command: '" #str "'"), discord_create_global_application_command(client, event->application->id, \
										       &params_##str##_##int_type, NULL)

#define INTERACTION_CALL(str, command) log_debug("Calling command: '"#str"'"); if (strcmp(event->data->name, str)==0) command(client, event)


void command_pong(struct discord *, const struct discord_interaction *event);

#endif
