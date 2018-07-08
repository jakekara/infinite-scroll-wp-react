This project demonstrates how to accomplish infinite scrolling, in this
case by using WordPress sites with the (v2) WP REST API enabled.

You can check it out live here:
    https://jakekara.github.io/infinite-scroll-wp-react/

Once you enter a new endpoint URL start scrolling to trigger reloading of
new content from the new site.

This defaults to ctmirror.org, but you can find sites that suppor the API
by google dorking for the following term:

   inurl:"wp-json/wp/v2/posts/"

Here are some I found:

* https://denverpost.com/wp-json/wp/v2
* https://movement.com/blog/wp-json/wp/v2