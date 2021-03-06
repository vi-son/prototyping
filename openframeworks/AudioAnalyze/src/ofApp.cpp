#include "ofApp.h"

//--------------------------------------------------------------
void ofApp::setup(){
    ofBackground(0);
    ofSetFrameRate(60);
    
    sampleRate = 44100;
    bufferSize = 512;
    int channels = 2;
    
    audioAnalyzer.setup(sampleRate, bufferSize, channels);
    
    player.load("audio/beatTrack.wav");

    _gui = new ofxDatGui(50, 50);
    _par_smoothing.set("Smoothing", 0, 0.0, 1.0);
    _gui->addSlider(_par_smoothing);

    _par_audiofile.set("Audiofile");
    _gui->addTextInput(_par_audiofile);

    _gui->addHeader(" + ");

    _gui->onSliderEvent(this, &ofApp::onSliderEvent);
   
}

//--------------------------------------------------------------
void ofApp::update(){
    
    ofSetWindowTitle(ofToString(ofGetFrameRate()));
    
    //-:Get buffer from sound player:
    soundBuffer = player.getCurrentSoundBuffer(bufferSize);
    
    //-:ANALYZE SOUNDBUFFER:
    audioAnalyzer.analyze(soundBuffer);
    
    //-:get Values:
    rms     = audioAnalyzer.getValue(RMS, 0, _par_smoothing.get());
    power   = audioAnalyzer.getValue(POWER, 0, _par_smoothing.get());
    pitchFreq = audioAnalyzer.getValue(PITCH_FREQ, 0, _par_smoothing.get());
    pitchConf = audioAnalyzer.getValue(PITCH_CONFIDENCE, 0, _par_smoothing.get());
    pitchSalience  = audioAnalyzer.getValue(PITCH_SALIENCE, 0, _par_smoothing.get());
    inharmonicity   = audioAnalyzer.getValue(INHARMONICITY, 0, _par_smoothing.get());
    hfc = audioAnalyzer.getValue(HFC, 0, _par_smoothing.get());
    specComp = audioAnalyzer.getValue(SPECTRAL_COMPLEXITY, 0, _par_smoothing.get());
    centroid = audioAnalyzer.getValue(CENTROID, 0, _par_smoothing.get());
    rollOff = audioAnalyzer.getValue(ROLL_OFF, 0, _par_smoothing.get());
    oddToEven = audioAnalyzer.getValue(ODD_TO_EVEN, 0, _par_smoothing.get());
    strongPeak = audioAnalyzer.getValue(STRONG_PEAK, 0, _par_smoothing.get());
    strongDecay = audioAnalyzer.getValue(STRONG_DECAY, 0, _par_smoothing.get());
    //Normalized values for graphic meters:
    pitchFreqNorm   = audioAnalyzer.getValue(PITCH_FREQ, 0, _par_smoothing.get(), TRUE);
    hfcNorm     = audioAnalyzer.getValue(HFC, 0, _par_smoothing.get(), TRUE);
    specCompNorm = audioAnalyzer.getValue(SPECTRAL_COMPLEXITY, 0, _par_smoothing.get(), TRUE);
    centroidNorm = audioAnalyzer.getValue(CENTROID, 0, _par_smoothing.get(), TRUE);
    rollOffNorm  = audioAnalyzer.getValue(ROLL_OFF, 0, _par_smoothing.get(), TRUE);
    oddToEvenNorm   = audioAnalyzer.getValue(ODD_TO_EVEN, 0, _par_smoothing.get(), TRUE);
    strongPeakNorm  = audioAnalyzer.getValue(STRONG_PEAK, 0, _par_smoothing.get(), TRUE);
    strongDecayNorm = audioAnalyzer.getValue(STRONG_DECAY, 0, _par_smoothing.get(), TRUE);
    
    dissonance = audioAnalyzer.getValue(DISSONANCE, 0, _par_smoothing.get());
    
    spectrum = audioAnalyzer.getValues(SPECTRUM, 0, _par_smoothing.get());
    melBands = audioAnalyzer.getValues(MEL_BANDS, 0, _par_smoothing.get());
    mfcc = audioAnalyzer.getValues(MFCC, 0, _par_smoothing.get());
    hpcp = audioAnalyzer.getValues(HPCP, 0, _par_smoothing.get());
    
    tristimulus = audioAnalyzer.getValues(TRISTIMULUS, 0, _par_smoothing.get());
    
    isOnset = audioAnalyzer.getOnsetValue(0);
  
   
}

//--------------------------------------------------------------
void ofApp::draw(){
    //-Single value Algorithms:
    ofPushMatrix();
    ofTranslate(350, 0);
    int mw = 250;
    int xpos = 0;
    int ypos = 30;
    
    float value, valueNorm;
    
    ofSetColor(255);
    value = rms;
    string strValue = "RMS: " + ofToString(value, 2);
    ofDrawBitmapString(strValue, xpos, ypos);
    ofSetColor(ofColor::cyan);
    ofDrawRectangle(xpos, ypos+5, value * mw, 10);
    
    ypos += 50;
    ofSetColor(255);
    value = power;
    strValue = "Power: " + ofToString(value, 2);
    ofDrawBitmapString(strValue, xpos, ypos);
    ofSetColor(ofColor::cyan);
    ofDrawRectangle(xpos, ypos+5, value * mw, 10);
    
    ypos += 50;
    ofSetColor(255);
    value = pitchFreq;
    valueNorm = pitchFreqNorm;
    strValue = "Pitch Frequency: " + ofToString(value, 2) + " hz.";
    ofDrawBitmapString(strValue, xpos, ypos);
    ofSetColor(ofColor::cyan);
    ofDrawRectangle(xpos, ypos+5, valueNorm * mw, 10);
    
    ypos += 50;
    ofSetColor(255);
    value = pitchConf;
    strValue = "Pitch Confidence: " + ofToString(value, 2);
    ofDrawBitmapString(strValue, xpos, ypos);
    ofSetColor(ofColor::cyan);
    ofDrawRectangle(xpos, ypos+5, value * mw, 10);
    
    ypos += 50;
    ofSetColor(255);
    value = pitchSalience;
    strValue = "Pitch Salience: " + ofToString(value, 2);
    ofDrawBitmapString(strValue, xpos, ypos);
    ofSetColor(ofColor::cyan);
    ofDrawRectangle(xpos, ypos+5, value * mw, 10);
    
    ypos += 50;
    ofSetColor(255);
    value = inharmonicity;
    strValue = "Inharmonicity: " + ofToString(value, 2);
    ofDrawBitmapString(strValue, xpos, ypos);
    ofSetColor(ofColor::cyan);
    ofDrawRectangle(xpos, ypos+5, value * mw, 10);
    
    ypos += 50;
    ofSetColor(255);
    value = hfc;
    valueNorm = hfcNorm;
    strValue = "HFC: " + ofToString(value, 2);
    ofDrawBitmapString(strValue, xpos, ypos);
    ofSetColor(ofColor::cyan);
    ofDrawRectangle(xpos, ypos+5, valueNorm * mw, 10);
    
    ypos += 50;
    ofSetColor(255);
    value = specComp;
    valueNorm = specCompNorm;
    strValue = "Spectral Complexity: " + ofToString(value, 2);
    ofDrawBitmapString(strValue, xpos, ypos);
    ofSetColor(ofColor::cyan);
    ofDrawRectangle(xpos, ypos+5, valueNorm * mw, 10);
    
    ypos += 50;
    ofSetColor(255);
    value = centroid;
    valueNorm = centroidNorm;
    strValue = "Centroid: " + ofToString(value, 2);
    ofDrawBitmapString(strValue, xpos, ypos);
    ofSetColor(ofColor::cyan);
    ofDrawRectangle(xpos, ypos+5, valueNorm * mw, 10);
    
    ypos += 50;
    ofSetColor(255);
    value = dissonance;
    strValue = "Dissonance: " + ofToString(value, 2);
    ofDrawBitmapString(strValue, xpos, ypos);
    ofSetColor(ofColor::cyan);
    ofDrawRectangle(xpos, ypos+5, value * mw, 10);
    
    ypos += 50;
    ofSetColor(255);
    value = rollOff;
    valueNorm = rollOffNorm;
    strValue = "Roll Off: " + ofToString(value, 2);
    ofDrawBitmapString(strValue, xpos, ypos);
    ofSetColor(ofColor::cyan);
    ofDrawRectangle(xpos, ypos+5, valueNorm * mw , 10);
    
    ypos += 50;
    ofSetColor(255);
    value = oddToEven;
    valueNorm = oddToEvenNorm;
    strValue = "Odd To Even Harmonic Energy Ratio: " + ofToString(value, 2);
    ofDrawBitmapString(strValue, xpos, ypos);
    ofSetColor(ofColor::cyan);
    ofDrawRectangle(xpos, ypos+5, valueNorm * mw, 10);
    
    ypos += 50;
    ofSetColor(255);
    value = strongPeak;
    valueNorm = strongPeakNorm;
    strValue = "Strong Peak: " + ofToString(value, 2);
    ofDrawBitmapString(strValue, xpos, ypos);
    ofSetColor(ofColor::cyan);
    ofDrawRectangle(xpos, ypos+5, valueNorm * mw, 10);
    
    ypos += 50;
    ofSetColor(255);
    value = strongDecay;
    valueNorm = strongDecayNorm;
    strValue = "Strong Decay: " + ofToString(value, 2);
    ofDrawBitmapString(strValue, xpos, ypos);
    ofSetColor(ofColor::cyan);
    ofDrawRectangle(xpos, ypos+5, valueNorm * mw, 10);
    
    ypos += 50;
    ofSetColor(255);
    value = isOnset;
    strValue = "Onsets: " + ofToString(value);
    ofDrawBitmapString(strValue, xpos, ypos);
    ofSetColor(ofColor::cyan);
    ofDrawRectangle(xpos, ypos+5, value * mw, 10);
    
    ofPopMatrix();
    
    //-Vector Values Algorithms:
    ofPushMatrix();
    ofTranslate(700, 0);
    int graphH = 75;
    int yoffset = graphH + 50;
    ypos = 30;
    
    ofSetColor(255);
    ofDrawBitmapString("Spectrum: ", 0, ypos);
    ofPushMatrix();
    ofTranslate(0, ypos);
    ofSetColor(ofColor::cyan);
    float bin_w = (float) mw / spectrum.size();
    for (int i = 0; i < spectrum.size(); i++){
        float scaledValue = ofMap(spectrum[i], DB_MIN, DB_MAX, 0.0, 1.0, true);//clamped value
        float bin_h = -1 * (scaledValue * graphH);
        ofDrawRectangle(i*bin_w, graphH, bin_w, bin_h);
    }
    ofPopMatrix();
    
    ypos += yoffset;
    ofSetColor(255);
    ofDrawBitmapString("Mel Bands: ", 0, ypos);
    ofPushMatrix();
    ofTranslate(0, ypos);
    ofSetColor(ofColor::cyan);
    bin_w = (float) mw / melBands.size();
    for (int i = 0; i < melBands.size(); i++){
        float scaledValue = ofMap(melBands[i], DB_MIN, DB_MAX, 0.0, 1.0, true);//clamped value
        float bin_h = -1 * (scaledValue * graphH);
        ofDrawRectangle(i*bin_w, graphH, bin_w, bin_h);
    }
    ofPopMatrix();
    
    ypos += yoffset;
    ofSetColor(255);
    ofDrawBitmapString("MFCC: ", 0, ypos);
    ofPushMatrix();
    ofTranslate(0, ypos);
    ofSetColor(ofColor::cyan);
    bin_w = (float) mw / mfcc.size();
    for (int i = 0; i < mfcc.size(); i++){
        float scaledValue = ofMap(mfcc[i], 0, MFCC_MAX_ESTIMATED_VALUE, 0.0, 1.0, true);//clamped value
        float bin_h = -1 * (scaledValue * graphH);
        ofDrawRectangle(i*bin_w, graphH, bin_w, bin_h);
    }
    ofPopMatrix();
    
    ypos += yoffset;
    ofSetColor(255);
    ofDrawBitmapString("HPCP: ", 0, ypos);
    ofPushMatrix();
    ofTranslate(0, ypos);
    ofSetColor(ofColor::cyan);
    bin_w = (float) mw / hpcp.size();
    for (int i = 0; i < hpcp.size(); i++){
        //float scaledValue = ofMap(hpcp[i], DB_MIN, DB_MAX, 0.0, 1.0, true);//clamped value
        float scaledValue = hpcp[i];
        float bin_h = -1 * (scaledValue * graphH);
        ofDrawRectangle(i*bin_w, graphH, bin_w, bin_h);
    }
    ofPopMatrix();
    
    ypos += yoffset;
    ofSetColor(255);
    ofDrawBitmapString("Tristimulus: ", 0, ypos);
    ofPushMatrix();
    ofTranslate(0, ypos);
    ofSetColor(ofColor::cyan);
    bin_w = (float) mw / tristimulus.size();
    for (int i = 0; i < tristimulus.size(); i++){
        //float scaledValue = ofMap(hpcp[i], DB_MIN, DB_MAX, 0.0, 1.0, true);//clamped value
        float scaledValue = tristimulus[i];
        float bin_h = -1 * (scaledValue * graphH);
        ofDrawRectangle(i*bin_w, graphH, bin_w, bin_h);
    }
    ofPopMatrix();
    
    ofPopMatrix();
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){
    player.stop();
    switch (key) {
    case '1':
      player.load("audio/test440mono.wav");
      break;
    case '2':
      player.load("audio/flute.wav");
      break;
    case '3':
      player.load("audio/chord.wav");
      break;
    case '4':
      player.load("audio/cadence.wav");
      break;
    case '5':
      player.load("audio/beatTrack.wav");
      break;
    case '6':
      player.load("audio/noise.wav");
      break;
    case '7':
      player.load("audio/patterns.202006.mp3");
      break;

    default:
      break;
    }
    player.play();
    
}
//--------------------------------------------------------------
void ofApp::exit(){
    audioAnalyzer.exit();
    player.stop();
}
//--------------------------------------------------------------
void ofApp::keyReleased(int key){

}

//--------------------------------------------------------------
void ofApp::mouseMoved(int x, int y ){

}

//--------------------------------------------------------------
void ofApp::mouseDragged(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mousePressed(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mouseReleased(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mouseEntered(int x, int y){

}

//--------------------------------------------------------------
void ofApp::mouseExited(int x, int y){

}

//--------------------------------------------------------------
void ofApp::windowResized(int w, int h){

}

//--------------------------------------------------------------
void ofApp::gotMessage(ofMessage msg){

}

//--------------------------------------------------------------
void ofApp::dragEvent(ofDragInfo dragInfo){ 

}


//--------------------------------------------------------------
void ofApp::onSliderEvent(ofxDatGuiSliderEvent e) {
  
}
