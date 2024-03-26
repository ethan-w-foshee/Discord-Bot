#include <stddef.h>
#include <stdlib.h>
#include <string.h>
#include <stdio.h>

int main(int argc, char** argv) {
  if (argc < 2) return 1;
  FILE* out = fopen(argv[argc-1],"wb");
  if (out == NULL) return 2;
  for (int i=1; i<argc-1; ++i) {
    char* txt;
    size_t txt_sz = 0;
    FILE* in = fopen(argv[i],"rb");
    if (in == NULL) {
      txt = argv[i];
      txt_sz = strlen(txt);
      fwrite(txt, txt_sz, 1, out);
    }else {
      fseek(in, 0, SEEK_END);
      txt_sz = ftell(in);
      fseek(in, 0, SEEK_SET);
      txt = (char*) malloc(txt_sz);
      if (txt == NULL) return 3;
      fread(txt, txt_sz, 1, in);
      fclose(in);
      fwrite(txt, txt_sz, 1, out);
      free(txt);
    }
    fputc('\n',out);
  }
  fclose(out);
  return 0;
}
