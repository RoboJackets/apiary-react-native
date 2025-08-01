//
//  BuzzCardReader.m
//  reactnativetest
//
//  Created by James Vogt on 7/15/25.
//
#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(BuzzCardReader, NSObject)
RCT_EXTERN_METHOD(
    sendCommand: (NSArray<NSNumber *> *)app
    cmd: (NSArray<NSNumber *> *)cmd
    jsCallback: (RCTResponseSenderBlock)callback
)
RCT_EXTERN_METHOD(
    readGtid: (RCTResponseSenderBlock)jsCallback
)
@end
