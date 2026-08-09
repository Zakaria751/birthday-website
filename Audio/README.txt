Put the background song here, named exactly:

  Birthday song.mp3

(index.html also lists .m4a / .wav / .ogg as fallbacks in case the file
ends up with a different extension — the browser just tries each one
until it finds a file that exists, so you don't have to touch the code.
If you know the extension already, you can delete the other <source>
lines in index.html, but you don't have to.)

It's already set to loop forever once it starts playing, and it starts
on the visitor's first tap/click anywhere on the page (browsers block
autoplay-with-sound until then). If the file is missing, the music
button just goes inactive — nothing else breaks.
