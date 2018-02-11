cubehash.js:
	emcc -O3 \
	     --memory-init-file 0 \
         -s NO_FILESYSTEM=1 \
         -s MODULARIZE=1 \
	     -s EXPORT_NAME="'CubeHashModule'" \
	     -s EXTRA_EXPORTED_RUNTIME_METHODS="['writeArrayToMemory', 'cwrap']" \
	     -s EXPORTED_FUNCTIONS="['_cubehash']" \
	     cubehash.c \
	     -o cubehash.js

clean:
	rm -f cubehash.js
