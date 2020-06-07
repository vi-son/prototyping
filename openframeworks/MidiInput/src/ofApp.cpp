/*
 * Copyright (c) 2013 Dan Wilcox <danomatika@gmail.com>
 *
 * BSD Simplified License.
 * For information on usage and redistribution, and for a DISCLAIMER OF ALL
 * WARRANTIES, see the file, "LICENSE.txt," in this distribution.
 *
 * See https://github.com/danomatika/ofxMidi for documentation
 *
 */
#include "ofApp.h"

//--------------------------------------------------------------
void ofApp::setup() {
	ofSetVerticalSync(true);
	ofBackground(255, 255, 255);
	ofSetLogLevel(OF_LOG_VERBOSE);
	// print input ports to console
	midiIn.listInPorts();
	// open port by number (you may need to change this)
	midiIn.openPort(0);
	//midiIn.openPort("IAC Pure Data In");	// by name
	//midiIn.openVirtualPort("ofxMidiIn Input"); // open a virtual port
	// don't ignore sysex, timing, & active sense messages,
	// these are ignored by default
	midiIn.ignoreTypes(false, false, false);
	// add ofApp as a listener
	midiIn.addListener(this);
	// print received messages to the console
	midiIn.setVerbose(true);
}

//--------------------------------------------------------------
void ofApp::update() {
}

//--------------------------------------------------------------
void ofApp::draw() {
  // ofSetColor(ofColor::fromHex(0x01060c));
  // ofDrawBitmapString(ofGetFrameRate(), glm::vec2(20, 20));
  float radius = 200.0;
  const int COUNT = 50;
  float angle_step = glm::two_pi<float>() / (float)COUNT;
  // for (int i = 0; i < COUNT; i++) {
  //   float x = radius * glm::sin(i * angle_step);
  //   float y = radius * glm::cos(i * angle_step);
  //   float x2 = (radius + 200) * glm::sin(i * angle_step);
  //   float y2 = (radius + 200) * glm::cos(i * angle_step);
  //   ofSetColor(ofColor::fromHsb(i * 255 / COUNT, 220, 200));
  //   ofPushMatrix();
  //   ofTranslate(ofGetWidth()  / 2,
  //               ofGetHeight() / 2);
  //   ofDrawLine(glm::vec2(x, y), glm::vec2(x2, y2));
  //   ofPopMatrix();
  // }

	for(unsigned int i = 0; i < midiMessages.size(); ++i) {
		ofxMidiMessage &message = midiMessages[i];
		int x = 0; //radius * glm::sin(i * angle_step);
		int y = i * 20; //radius * glm::cos(i * angle_step);
    int height = 10;
		// draw the last recieved message contents to the screen,
		// this doesn't print all the data from every status type
		// but you should get the general idea
		stringstream text;
		text << ofxMidiMessage::getStatusString(message.status);
		while(text.str().length() < 16) { // pad status width
			text << " ";
		}
		ofSetColor(127);
    // ofRotateRad(i * angle_step);
    ofPushMatrix();
    ofTranslate(glm::vec2(x, y));
		if(message.status < MIDI_SYSEX) {
			// text << "chan: " << message.channel;
			if(message.status == MIDI_CONTROL_CHANGE) {
				// text << "\tctl: " << message.control;
        auto width = ofMap(message.control, 0, 127, 0, ofGetWidth() * 0.2);
				ofDrawRectangle(0, 0, width, height);
			}
			if(message.status == MIDI_PITCH_BEND) {
				// text << "\tval: " << message.value;
        auto width = ofMap(message.value, 0, MIDI_MAX_BEND, 0, ofGetWidth()*0.2);
				ofDrawRectangle(0, 0, width, height);
			}
			else {
				// text << "\tpitch: " << message.pitch;
        auto pitch_width = ofMap(message.pitch, 0, 127, 0, ofGetWidth()*0.2);
				ofDrawRectangle(0, 0, pitch_width, height);
				// text << "\tvel: " << message.velocity;
        ofSetColor(0);
        auto velocity_width = ofMap(message.velocity, 0, 127, 0, ofGetWidth()*0.2);
				ofDrawRectangle(pitch_width, 0, velocity_width, height);
			}
			// text << " "; // pad for delta print
		}
    ofPopMatrix();
		text << "delta: " << message.deltatime;
		ofSetColor(0);
		ofDrawBitmapString(text.str(), x, y);
		text.str(""); // clear
	}
}

//--------------------------------------------------------------
void ofApp::exit() {
	// clean up
	midiIn.closePort();
	midiIn.removeListener(this);
}

//--------------------------------------------------------------
void ofApp::newMidiMessage(ofxMidiMessage& msg) {
	// add the latest message to the message queue
	midiMessages.push_back(msg);
	// remove any old messages if we have too many
	while(midiMessages.size() > maxMessages) {
		midiMessages.erase(midiMessages.begin());
	}
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key) {
	switch(key) {
		case '?':
			midiIn.listInPorts();
			break;
	}
}

//--------------------------------------------------------------
void ofApp::keyReleased(int key) {
}

//--------------------------------------------------------------
void ofApp::mouseMoved(int x, int y) {
}

//--------------------------------------------------------------
void ofApp::mouseDragged(int x, int y, int button) {
}

//--------------------------------------------------------------
void ofApp::mousePressed(int x, int y, int button) {
}

//--------------------------------------------------------------
void ofApp::mouseReleased() {
}
