/**
 * @file feedmach.c
 * @author Abhishek Mishra (abhishekmishra3@gmail.com)
 * @brief CLI program to download and read RSS/ATOM feeds
 * @version 0.1
 * @date 2024-02-05
 * 
 * @copyright Copyright (c) 2024 Abhishek Mishra
 * 
 */
#include <stdio.h>
#include <curl/curl.h>

size_t write_data(void *buffer, size_t size, size_t nmemb, void *userp) {
    return fwrite(buffer, size, nmemb, (FILE *)userp);
}

int main(void) {
    CURL *curl;
    CURLcode res;
    FILE *fp;

    curl_global_init(CURL_GLOBAL_DEFAULT);
    curl = curl_easy_init();
    if(curl) {
        fp = fopen("feed.xml", "wb");
        if(fp == NULL) {
            printf("File cannot be opened\n");
            return 1;
        }

        curl_easy_setopt(curl, CURLOPT_URL, "http://example.com/rss");
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_data);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, fp);

        res = curl_easy_perform(curl);

        if(res != CURLE_OK)
        {
            fprintf(stderr, "curl_easy_perform() failed: %s\n", curl_easy_strerror(res));
        }
        
        curl_easy_cleanup(curl);
        fclose(fp);
    }

    curl_global_cleanup();
    return 0;
}
