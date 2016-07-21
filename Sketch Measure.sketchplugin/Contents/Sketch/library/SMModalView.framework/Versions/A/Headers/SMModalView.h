//
//  SMModalView.h
//  SMModalView
//
//  Created by Mike on 16/6/4.
//  Copyright © 2016年 hyz. All rights reserved.
//

#import <Cocoa/Cocoa.h>

//! Project version number for SMModalView.
FOUNDATION_EXPORT double SMModalViewVersionNumber;

//! Project version string for SMModalView.
FOUNDATION_EXPORT const unsigned char SMModalViewVersionString[];

// In this header, you should import all the public headers of your framework using statements like #import <SMModalView/PublicHeader.h>

@protocol SMModalViewDelegate <NSObject>

-(void)smAction:(NSDictionary*)data;
-(void)smInit:(NSString *)fileName;
-(void)smCancel:(NSString *)fileName;


@end

@interface SMModalView : NSObject
-(instancetype)initWithHtmlPath:(NSString *)path frame:(NSRect)frame;
-(void)setCBDelegate:(id<SMModalViewDelegate>)aDelegate;
-(void)showModal:(BOOL)flag;
-(void)stringByEvaluatingJavaScriptFromString:(NSString *)str;
@end