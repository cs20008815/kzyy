package org.clj.crmproj.util;


import net.sf.ehcache.Cache;
import net.sf.ehcache.CacheManager;
import net.sf.ehcache.Element;
import org.apache.shiro.config.ConfigurationException;
import org.apache.shiro.io.ResourceUtils;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

/**
 * Created by 00194550 on 2016/8/31.
 */
public class EhcacheUtil {
    private static final String path = "classpath:conf/ehcache.xml";
    private static final String cacheName = "safetyCache";
    private static CacheManager manager;
    private static class EhcacheHolder {

        static final EhcacheUtil INSTANCE = new EhcacheUtil();
    }
    public static EhcacheUtil getInstance(){
        return EhcacheHolder.INSTANCE;
    }

    protected InputStream getCacheManagerConfigFileInputStream() {
        String configFile = this.path;
        try {
            InputStream inStream=ResourceUtils.getInputStreamForPath(configFile);
            ByteArrayOutputStream swapStream = new ByteArrayOutputStream();
            byte[] buff = new byte[100];
            int rc = 0;
            while ((rc = inStream.read(buff, 0, 100)) > 0) {
                swapStream.write(buff, 0, rc);
            }
            System.out.println( new String(swapStream.toByteArray()));
            return ResourceUtils.getInputStreamForPath(configFile);

        } catch (IOException var3) {
            throw new ConfigurationException("Unable to obtain input stream for cacheManagerConfigFile [" + configFile + "]", var3);
        }
    }
    public EhcacheUtil(){
        manager = CacheManager.create(getCacheManagerConfigFileInputStream());
    }

    public void put( String key, Object value) {
        Cache cache = manager.getCache(cacheName);
        Element element = new Element(key, value);
        cache.put(element);
    }

    public Object get( String key) {
        Cache cache = manager.getCache(cacheName);
        Element element = cache.get(key);
        return element == null ? null : element.getObjectValue();
    }



    public void remove( String key) {
        Cache cache = manager.getCache(cacheName);
        cache.remove(key);
    }
}
